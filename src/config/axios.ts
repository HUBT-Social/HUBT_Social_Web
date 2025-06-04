import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { BASE_API_URL } from './env';

// ==================== TYPES ====================
interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

interface RequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean;
}

// ==================== TOKEN MANAGER ====================
class TokenManager {
  private tokenCache: string | null = null;
  private isInitialized: boolean = false;

  private initialize(): void {
    if (this.isInitialized) return;
    
    console.log('🔧 TokenManager: Initializing...');
    
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        console.log('❌ TokenManager: localStorage not available');
        this.tokenCache = null;
      } else {
        const token = localStorage.getItem('authToken');
        this.tokenCache = token?.trim() || null;
        console.log('📱 TokenManager: Loaded from localStorage:', this.tokenCache ? 'TOKEN_EXISTS' : 'NO_TOKEN');
      }
    } catch (error) {
      console.warn('⚠️ TokenManager: Failed to initialize from localStorage:', error);
      this.tokenCache = null;
    }
    
    this.isInitialized = true;
  }

  getToken(): string | null {
    this.initialize();
    console.log('🔍 TokenManager.getToken() called, returning:', this.tokenCache ? 'TOKEN_EXISTS' : 'NULL');
    return this.tokenCache;
  }

  setToken(token: string): void {
    console.log('💾 TokenManager.setToken() called with:', token ? 'TOKEN_PROVIDED' : 'EMPTY_TOKEN');
    
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('authToken', token);
        console.log('✅ TokenManager: Saved to localStorage');
      }
      this.tokenCache = token;
      this.isInitialized = true;
      console.log('✅ TokenManager: Token cached in memory');
    } catch (error) {
      console.warn('⚠️ TokenManager: Failed to save token:', error);
      this.tokenCache = token;
    }
  }

  clearToken(): void {
    console.log('🗑️ TokenManager.clearToken() called');
    
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem('authToken');
        console.log('✅ TokenManager: Removed from localStorage');
      }
      this.tokenCache = null;
      this.isInitialized = true;
      console.log('✅ TokenManager: Cleared from memory cache');
    } catch (error) {
      console.warn('⚠️ TokenManager: Failed to clear token:', error);
      this.tokenCache = null;
    }
  }

  hasValidToken(): boolean {
    const token = this.getToken();
    const isValid = !!(token && token.length > 0);
    console.log('🔐 TokenManager.hasValidToken():', isValid);
    return isValid;
  }
}

// ==================== API CLIENT ====================
class ApiClient {
  private instance: AxiosInstance;
  private tokenManager: TokenManager;

  constructor(baseURL: string, timeout: number = 30000) {
    console.log('🚀 ApiClient: Constructor called with baseURL:', baseURL);
    
    this.tokenManager = new TokenManager();
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
    console.log('✅ ApiClient: Initialization complete');
  }
  public setUpHeaderBeforeLogin(): void {
    this.instance.interceptors.request.use(
      (config) => {
          const token = this.tokenManager.getToken();
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 Request: Added Authorization header');
          } else {
            console.log('❌ Request: No token available');
          }
        return config;
      }
    );
  }
  private setupInterceptors(): void {
    console.log('🔧 ApiClient: Setting up interceptors...');
    
    // Request interceptor - add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const skipAuth = (config as RequestOptions).skipAuth;
        console.log(`📤 Request to ${config.url}, skipAuth: ${skipAuth}`);
        
        if (!skipAuth) {
          const token = this.tokenManager.getToken();
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 Request: Added Authorization header');
          } else {
            console.log('❌ Request: No token available');
          }
        } else {
          console.log('⏭️ Request: Skipping auth as requested');
        }
        
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.instance.interceptors.response.use(
      (response) => {
        console.log(`📥 Response from ${response.config.url}: ${response.status}`);
        return response;
      },
      (error: AxiosError) => {
        console.error(`❌ Response error from ${error.config?.url}:`, error.response?.status);
        
        if (error.response?.status === 401) {
          console.log('🚨 401 Unauthorized - Clearing token and dispatching event');
          this.tokenManager.clearToken();
          
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          }
        }
        
        return Promise.reject(this.handleError(error));
      }
    );
    
    console.log('✅ ApiClient: Interceptors setup complete');
  }

  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
    };

    if (error.response?.data) {
      const data = error.response.data as any;
      apiError.message = data.message || data.error || apiError.message;
      apiError.errors = data.errors;
    } else if (error.message) {
      apiError.message = error.message;
    }

    return apiError;
  }

  // HTTP Methods với logging
  async get<T = any>(url: string, config?: RequestOptions): Promise<T> {
    console.log(`🌐 GET request to: ${url}`);
    const response = await this.instance.get<T>(url, config);
    console.log(`✅ GET response from ${url}: Success`);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: RequestOptions): Promise<T> {
    console.log(`🌐 POST request to: ${url}`);
    const response = await this.instance.post<T>(url, data, config);
    console.log(`✅ POST response from ${url}: Success`);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: RequestOptions): Promise<T> {
    console.log(`🌐 PUT request to: ${url}`);
    const response = await this.instance.put<T>(url, data, config);
    console.log(`✅ PUT response from ${url}: Success`);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: RequestOptions): Promise<T> {
    console.log(`🌐 PATCH request to: ${url}`);
    const response = await this.instance.patch<T>(url, data, config);
    console.log(`✅ PATCH response from ${url}: Success`);
    return response.data;
  }

  async delete<T = any>(url: string, config?: RequestOptions): Promise<T> {
    console.log(`🌐 DELETE request to: ${url}`);
    const response = await this.instance.delete<T>(url, config);
    console.log(`✅ DELETE response from ${url}: Success`);
    return response.data;
  }

  // File upload
  async upload<T = any>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> {
    console.log(`📤 Upload request to: ${url}`);
    const response = await this.instance.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress ? (e) => {
        if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
      } : undefined,
    });
    console.log(`✅ Upload response from ${url}: Success`);
    return response.data;
  }

  // Authentication methods
  async login<T = any>(credentials: any): Promise<T> {
    console.log('🔐 Login attempt...');
    const response = await this.post<T>('/auth/login', credentials, { skipAuth: true });
    console.log('✅ Login successful');
    return response;
  }

  async register<T = any>(userData: any): Promise<T> {
    console.log('📝 Register attempt...');
    const response = await this.post<T>('/auth/register', userData, { skipAuth: true });
    console.log('✅ Register successful');
    return response;
  }

  // Utility methods
  withoutAuth() {
    return {
      get: <T = any>(url: string, config?: RequestOptions) => 
        this.get<T>(url, { ...config, skipAuth: true }),
      post: <T = any>(url: string, data?: any, config?: RequestOptions) => 
        this.post<T>(url, data, { ...config, skipAuth: true }),
      put: <T = any>(url: string, data?: any, config?: RequestOptions) => 
        this.put<T>(url, data, { ...config, skipAuth: true }),
      patch: <T = any>(url: string, data?: any, config?: RequestOptions) => 
        this.patch<T>(url, data, { ...config, skipAuth: true }),
      delete: <T = any>(url: string, config?: RequestOptions) => 
        this.delete<T>(url, { ...config, skipAuth: true }),
    };
  }

  // Token management với logging
  setToken(token: string): void {
    console.log('🔐 ApiClient.setToken() called');
    this.tokenManager.setToken(token);
    this.setUpHeaderBeforeLogin();
  }

  clearToken(): void {
    console.log('🗑️ ApiClient.clearToken() called');
    this.tokenManager.clearToken();
  }

  getToken(): string | null {
    console.log('🔍 ApiClient.getToken() called');
    return this.tokenManager.getToken();
  }

  hasValidToken(): boolean {
    console.log('🔐 ApiClient.hasValidToken() called');
    return this.tokenManager.hasValidToken();
  }

  isAuthenticated(): boolean {
    console.log('🔐 ApiClient.isAuthenticated() called');
    return this.hasValidToken();
  }

  // Debug method
  debugTokenState(): void {
    console.log('🐛 === TOKEN DEBUG INFO ===');
    console.log('Token from memory cache:', this.tokenManager.getToken());
    console.log('Has valid token:', this.hasValidToken());
    console.log('Is authenticated:', this.isAuthenticated());
    
    try {
      const lsToken = localStorage.getItem('authToken');
      console.log('Token from localStorage:', lsToken);
    } catch (e) {
      console.log('Cannot access localStorage:', e);
    }
    console.log('🐛 === END DEBUG INFO ===');
  }
}

// ==================== EXPORT ====================
export default new ApiClient(BASE_API_URL);
export type { ApiClient };
export type { ApiError, RequestOptions };