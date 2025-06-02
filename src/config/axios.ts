import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { BASE_API_URL } from '../config/env';

// ==================== TYPES ====================

interface TokenConfig {
  localStorageKeys: string[];
  sessionStorageKeys: string[];
  cookieKeys?: string[];
  secureCookies?: boolean; // Enable Secure, HttpOnly, SameSite cookies
}

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
}

interface ApiError {
  message: string;
  status: number | any;
  errors?: Record<string, string[]>;
}

type UploadProgressCallback = (progressEvent: ProgressEvent) => void;

interface RequestOptions extends Omit<AxiosRequestConfig, 'headers'> {
  headers?: Record<string, string>;
  skipAuth?: boolean;
  retries?: number; // Number of retry attempts
}

type QueryParams = Record<string, string | number | boolean | undefined | null>;

interface RequestConfig {
  baseURL?: string;
  timeout?: number;
  maxRetries?: number;
}

// ==================== TOKEN MANAGEMENT ====================

const DEFAULT_TOKEN_CONFIG: TokenConfig = {
  localStorageKeys: ['authToken', 'token', 'accessToken', 'jwt'],
  sessionStorageKeys: ['authToken', 'token', 'accessToken', 'jwt'],
  cookieKeys: ['authToken', 'token'],
  secureCookies: true,
};

class TokenManager {
  private config: TokenConfig;
  private tokenCache: string | null = null;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(config: TokenConfig = DEFAULT_TOKEN_CONFIG) {
    this.config = config;
  }

  async getToken(): Promise<string | null> {
    if (this.tokenCache !== null) {
      console.debug('Returning cached token');
      return this.tokenCache;
    }

    // Prioritize localStorage
    for (const key of this.config.localStorageKeys) {
      try {
        const token = localStorage.getItem(key);
        if (token && token.trim() && this.isTokenValid(token)) {
          console.debug(`Token found in localStorage with key: ${key}`);
          this.tokenCache = token.trim();
          return this.tokenCache;
        }
      } catch (error) {
        console.warn(`Failed to access localStorage for key ${key}:`, error);
      }
    }

    // Try sessionStorage
    for (const key of this.config.sessionStorageKeys) {
      try {
        const token = sessionStorage.getItem(key);
        if (token && token.trim() && this.isTokenValid(token)) {
          console.debug(`Token found in sessionStorage with key: ${key}`);
          this.tokenCache = token.trim();
          return this.tokenCache;
        }
      } catch (error) {
        console.warn(`Failed to access sessionStorage for key ${key}:`, error);
      }
    }

    // Try cookies
    if (this.config.cookieKeys && typeof document !== 'undefined') {
      for (const key of this.config.cookieKeys) {
        try {
          const token = this.getCookie(key);
          if (token && token.trim() && this.isTokenValid(token)) {
            console.debug(`Token found in cookies with key: ${key}`);
            this.tokenCache = token.trim();
            return this.tokenCache;
          }
        } catch (error) {
          console.warn(`Failed to access cookie for key ${key}:`, error);
        }
      }
    }

    console.debug('No valid token found');
    this.tokenCache = null;
    return null;
  }

  setToken(token: string, key: string = 'authToken'): void {
    try {
      localStorage.setItem(key, token);
      this.tokenCache = token;
      console.debug(`Token saved to localStorage with key: ${key}`);
      if (this.config.secureCookies && this.config.cookieKeys?.includes(key)) {
        this.setCookie(key, token);
      }
    } catch (error) {
      console.warn('Failed to save token to localStorage:', error);
      try {
        sessionStorage.setItem(key, token);
        this.tokenCache = token;
        console.debug(`Token saved to sessionStorage as fallback with key: ${key}`);
      } catch (fallbackError) {
        console.error('Failed to save token to sessionStorage:', fallbackError);
      }
    }
  }

  clearToken(): void {
    this.config.localStorageKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove ${key} from localStorage:`, error);
      }
    });

    this.config.sessionStorageKeys.forEach(key => {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove ${key} from sessionStorage:`, error);
      }
    });

    if (this.config.cookieKeys && typeof document !== 'undefined') {
      this.config.cookieKeys.forEach(key => {
        try {
          this.setCookie(key, '', -1);
        } catch (error) {
          console.warn(`Failed to remove ${key} from cookies:`, error);
        }
      });
    }

    this.tokenCache = null;
    console.debug('All tokens cleared');
  }

  isTokenValid(token: string): boolean {
    if (!token || token.trim().length === 0) return false;

    const jwtPattern = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
    if (jwtPattern.test(token)) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp) {
          const currentTime = Math.floor(Date.now() / 1000);
          return payload.exp > currentTime + 60; // Consider token invalid 60s before expiry
        }
      } catch (error) {
        console.warn('Failed to decode JWT token:', error);
      }
    }
    return true; // Non-JWT tokens are considered valid
  }

  async refreshToken(): Promise<string | null> {
    if (this.refreshPromise) {
      console.debug('Awaiting existing refresh token promise');
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshResponse = await axios.post<{ token: string }>(
          `${BASE_API_URL}/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = refreshResponse.data.token;
        this.setToken(newToken);
        console.debug('Token refreshed successfully');
        return newToken;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        this.clearToken();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let c of ca) {
      c = c.trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
  }

  private setCookie(name: string, value: string, days: number = 7): void {
    if (typeof document === 'undefined') return;
    let expires = '';
    if (days !== -1) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    const secure = this.config.secureCookies ? '; Secure; HttpOnly; SameSite=Strict' : '';
    document.cookie = `${name}=${value}${expires}; path=/${secure}`;
  }
}

// ==================== AXIOS INSTANCE SETUP ====================

const createAxiosInstance = (config: RequestConfig): AxiosInstance => {
  return axios.create({
    baseURL: config.baseURL || BASE_API_URL,
    timeout: config.timeout || 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true,
  });
};

// ==================== REQUEST WRAPPER CLASS ====================

class RequestWrapper {
  private instance: AxiosInstance;
  private tokenManager: TokenManager;
  private maxRetries: number;

  constructor(requestConfig: RequestConfig = {}, tokenConfig?: TokenConfig) {
    this.instance = createAxiosInstance(requestConfig);
    this.tokenManager = new TokenManager(tokenConfig);
    this.maxRetries = requestConfig.maxRetries || 3;
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (process.env.NODE_ENV !== 'production') {
          console.debug(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        }

        const skipAuth = (config as any).skipAuth;
        if (skipAuth) return config;

        let token = await this.tokenManager.getToken();
        if (!token || !this.tokenManager.isTokenValid(token)) {
          token = await this.tokenManager.refreshToken();
        }

        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error: AxiosError) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (process.env.NODE_ENV !== 'production') {
          console.debug(`✅ ${response.config.url} - Status: ${response.status}`);
        }
        return response;
      },
      async (error: AxiosError) => {
        const config = error.config as InternalAxiosRequestConfig & { retries?: number };
        if (!config) return Promise.reject(error);

        // Handle 429 (Too Many Requests) with exponential backoff
        if (error.response?.status === 429) {
          const retryCount = (config.retries || 0) + 1;
          if (retryCount <= this.maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
            console.debug(`Retrying request (${retryCount}/${this.maxRetries}) after ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
            config.retries = retryCount;
            return this.instance(config);
          }
        }

        if (error.response?.status === 401) {
          this.handleUnauthorized();
        } else if (error.response?.status === 403) {
          console.warn('🚫 Forbidden - Insufficient permissions');
        } else if (error.response?.status === 500) {
          console.error('🔥 Server error');
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleUnauthorized(): void {
    this.tokenManager.clearToken();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
  }

  async get<T = any>(url: string, params?: QueryParams, options?: RequestOptions): Promise<T> {
    try {
      const response = await this.instance.get<T>(url, { ...options, params });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    try {
      const response = await this.instance.post<T>(url, data, options);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async put<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    try {
      const response = await this.instance.put<T>(url, data, options);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async patch<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    try {
      const response = await this.instance.patch<T>(url, data, options);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async delete<T = any>(url: string, options?: RequestOptions): Promise<T> {
    try {
      const response = await this.instance.delete<T>(url, options);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async upload<T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: any,
    options?: RequestOptions
  ): Promise<T> {
    try {
      const config: AxiosRequestConfig = {
        ...options,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...options?.headers,
        },
        onUploadProgress,
      };
      const response = await this.instance.post<T>(url, formData, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  withoutAuth() {
    return {
      get: <T = any>(url: string, params?: QueryParams, options?: RequestOptions) =>
        this.get<T>(url, params, { ...options, skipAuth: true }),
      post: <T = any>(url: string, data?: any, options?: RequestOptions) =>
        this.post<T>(url, data, { ...options, skipAuth: true }),
      put: <T = any>(url: string, data?: any, options?: RequestOptions) =>
        this.put<T>(url, data, { ...options, skipAuth: true }),
      patch: <T = any>(url: string, data?: any, options?: RequestOptions) =>
        this.patch<T>(url, data, { ...options, skipAuth: true }),
      delete: <T = any>(url: string, options?: RequestOptions) =>
        this.delete<T>(url, { ...options, skipAuth: true }),
      upload: <T = any>(
        url: string,
        formData: FormData,
        onUploadProgress?: UploadProgressCallback,
        options?: RequestOptions
      ) => this.upload<T>(url, formData, onUploadProgress, { ...options, skipAuth: true }),
    };
  }

  withToken(token: string) {
    return {
      get: <T = any>(url: string, params?: QueryParams, options?: RequestOptions) =>
        this.get<T>(url, params, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${token}` },
        }),
      post: <T = any>(url: string, data?: any, options?: RequestOptions) =>
        this.post<T>(url, data, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${token}` },
        }),
      put: <T = any>(url: string, data?: any, options?: RequestOptions) =>
        this.put<T>(url, data, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${token}` },
        }),
      patch: <T = any>(url: string, data?: any, options?: RequestOptions) =>
        this.patch<T>(url, data, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${token}` },
        }),
      delete: <T = any>(url: string, options?: RequestOptions) =>
        this.delete<T>(url, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${token}` },
        }),
      upload: <T = any>(
        url: string,
        formData: FormData,
        onUploadProgress?: UploadProgressCallback,
        options?: RequestOptions
      ) =>
        this.upload<T>(url, formData, onUploadProgress, {
          ...options,
          headers: { ...options?.headers, Authorization: `Bearer ${token}` },
        }),
    };
  }

  getCurrentToken():  Promise<string | null> {
    return this.tokenManager.getToken();
  }

  setToken(token: string, key?: string): void {
    this.tokenManager.setToken(token, key);
  }

  clearToken(): void {
    this.tokenManager.clearToken();
  }

  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
    };

    if (error.response?.data) {
      const responseData = error.response.data as any;
      apiError.message = responseData.message || responseData.error || apiError.message;
      apiError.errors = responseData.errors;
    } else if (error.message) {
      apiError.message = `${error.message} (${error.code || 'UNKNOWN'})`;
    }

    console.error('API Error:', apiError);
    return apiError;
  }
}

// ==================== EXPORT ====================

const request = new RequestWrapper();
export default request;
export { RequestWrapper, TokenManager };
export type { ApiResponse, ApiError, RequestOptions, QueryParams, UploadProgressCallback, TokenConfig, RequestConfig };