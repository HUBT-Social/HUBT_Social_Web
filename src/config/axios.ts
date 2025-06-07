import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { BASE_API_URL,BASE_API_AUTH,BASE_API_CHAT,BASE_API_NOTIFICATION,BASE_API_USER, BASE_API_TEMP,BASE_API_OUT } from './env';
import { AUTH_ENDPOINTS } from '../services/endpoints';

// ==================== TYPES ====================
interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

interface RequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean;
}

interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  autoAuth?: boolean;
  headers?: Record<string, string>;
}
interface JWTPayload {
  exp: number;
  role?: string;
  roles?: string[];
  // Các field khác có thể có trong token
  [key: string]: any;
}
// ==================== GLOBAL TOKEN MANAGER ====================
class GlobalTokenManager {
  private static instance: GlobalTokenManager;
  private tokenCache: string | null = null;
  private isInitialized: boolean = false;
  private listeners: Set<(token: string | null) => void> = new Set();

  private constructor() {}

  static getInstance(): GlobalTokenManager {
    if (!GlobalTokenManager.instance) {
      GlobalTokenManager.instance = new GlobalTokenManager();
    }
    return GlobalTokenManager.instance;
  }

  private initialize(): void {
    if (this.isInitialized) return;
    
    console.log('🔧 GlobalTokenManager: Initializing...');
    
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        console.log('❌ GlobalTokenManager: localStorage not available');
        this.tokenCache = null;
      } else {
        const token = localStorage.getItem('authToken');
        this.tokenCache = token?.trim() || null;
        console.log('📱 GlobalTokenManager: Loaded from localStorage:', this.tokenCache ? 'TOKEN_EXISTS' : 'NO_TOKEN');
      }
    } catch (error) {
      console.warn('⚠️ GlobalTokenManager: Failed to initialize from localStorage:', error);
      this.tokenCache = null;
    }
    
    this.isInitialized = true;
  }

  getToken(): string | null {
    this.initialize();
    return this.tokenCache;
  }

  setToken(token: string): void {
    console.log('💾 GlobalTokenManager.setToken() called with:', token ? 'TOKEN_PROVIDED' : 'EMPTY_TOKEN');
    
    const oldToken = this.tokenCache;
    
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('authToken', token);
        console.log('✅ GlobalTokenManager: Saved to localStorage');
      }
      this.tokenCache = token;
      this.isInitialized = true;
      console.log('✅ GlobalTokenManager: Token cached in memory');
      
      // Notify all listeners about token change
      if (oldToken !== token) {
        this.notifyListeners(token);
      }
    } catch (error) {
      console.warn('⚠️ GlobalTokenManager: Failed to save token:', error);
      this.tokenCache = token;
    }
  }

  clearToken(): void {
    console.log('🗑️ GlobalTokenManager.clearToken() called');
    
    const oldToken = this.tokenCache;
    
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem('authToken');
        console.log('✅ GlobalTokenManager: Removed from localStorage');
      }
      this.tokenCache = null;
      this.isInitialized = true;
      console.log('✅ GlobalTokenManager: Cleared from memory cache');
      
      // Notify all listeners about token clearing
      if (oldToken !== null) {
        this.notifyListeners(null);
      }
    } catch (error) {
      console.warn('⚠️ GlobalTokenManager: Failed to clear token:', error);
      this.tokenCache = null;
    }
  }
  private decodeJWT(token: string): JWTPayload | null {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          return null;
        }
        
        // Decode payload (phần thứ 2)
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
      }
  }
  private checkUserRole(payload: JWTPayload): boolean {
    console.log('Full payload:', JSON.stringify(payload, null, 2));
    console.log('payload.role:', payload.role);
    console.log('payload.roles:', payload.roles);
    
    const validRoles = ['TEACHER', 'ADMIN'];
    
    // Kiểm tra trường hợp role là array
    if (payload.role && Array.isArray(payload.role) && payload.role.length > 0) {
        console.log('Check role array:', payload.role);
        const hasValidRole = payload.role.some(role => {
            console.log('Checking role:', role, 'Type:', typeof role);
            return validRoles.includes(role.toString());
        });
        console.log('Has valid role in array:', hasValidRole);
        return hasValidRole;
    }
    
    // Kiểm tra trường hợp role là string đơn
    if (payload.role && typeof payload.role === 'string' && validRoles.includes(payload.role)) {
        console.log('✓ Valid single role found:', payload.role);
        return true;
    }
    
    // Kiểm tra trường hợp roles array (nếu có)
    if (payload.role && Array.isArray(payload.role) && payload.role.length > 0) {
        console.log('Check roles array:', payload.roles);
        const hasValidRole = payload.role.some(role => {
            console.log('Checking role:', role, 'Type:', typeof role);
            return validRoles.includes(role.toString());
        });
        console.log('Has valid role in array:', hasValidRole);
        return hasValidRole;
    }
    
    console.log("Token has no valid role");
    return false;
}

  public getTokenInfo(token: string | null): { isValid: boolean; isExpired: boolean; role: string | null; expiresAt: Date | null } {
    token = token ?? this.getToken();
    
    if (!token || token.length === 0) {
      return { isValid: false, isExpired: false, role: null, expiresAt: null };
    }
    
    const payload = this.decodeJWT(token);
    if (!payload) {
      return { isValid: false, isExpired: false, role: null, expiresAt: null };
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp ? payload.exp < currentTime : false;
    const hasValidRole = this.checkUserRole(payload);
    const expiresAt = payload.exp ? new Date(payload.exp * 1000) : null;
    
    // Lấy role đầu tiên tìm thấy
    let role: string | null = null;
    if (payload.role) {
      role = payload.role;
    } else if (payload.role && Array.isArray(payload.role) && payload.role.length > 0) {
      role = payload.role[0];
    }
    
    return {
      isValid: !isExpired && hasValidRole,
      isExpired,
      role,
      expiresAt
    };
  }

hasValidToken(token: string | null): boolean {
    // Sử dụng nullish coalescing để gán giá trị
    token = token ?? this.getToken(); // ✅ Đúng cách
    
    console.log("Token: ", token);
    
    // Kiểm tra token có tồn tại không
    if (!token || token.length === 0) {
        console.log("Token has not exits");
        return false;
    }
    
    // Decode token
    const payload = this.decodeJWT(token);
    if (!payload) {
        console.log("Failed to decode token");
        return false;
    }
    
    // Kiểm tra token có còn hạn không (exp là timestamp tính bằng giây)
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
        console.log("Token is expired");
        return false;
    }
    
    // Kiểm tra role
    const hasValidRole = this.checkUserRole(payload);
    console.log("Has valid role:", hasValidRole);
    
    return hasValidRole;
}

  // Subscribe to token changes
  subscribe(callback: (token: string | null) => void): () => void {
    this.listeners.add(callback);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(token: string | null): void {
    console.log('📢 GlobalTokenManager: Notifying', this.listeners.size, 'listeners about token change');
    this.listeners.forEach(callback => {
      try {
        callback(token);
      } catch (error) {
        console.error('❌ Error in token change listener:', error);
      }
    });
  }

  // Force refresh token from localStorage (useful for cross-tab sync)
  refreshFromStorage(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    
    try {
      const token = localStorage.getItem('authToken');
      const newToken = token?.trim() || null;
      
      if (newToken !== this.tokenCache) {
        console.log('🔄 GlobalTokenManager: Token refreshed from storage');
        this.tokenCache = newToken;
        this.notifyListeners(newToken);
      }
    } catch (error) {
      console.warn('⚠️ GlobalTokenManager: Failed to refresh from storage:', error);
    }
  }
}

// ==================== API CLIENT ====================
class ApiClient {
  private instance: AxiosInstance;
  private tokenManager: GlobalTokenManager;
  private unsubscribeToken?: () => void;
  private autoAuth: boolean;

  constructor(config: ApiClientConfig = {}) {
    const {
      baseURL = BASE_API_URL,
      timeout = 30000,
      autoAuth = true,
      headers = {}
    } = config;

    console.log('🚀 ApiClient: Constructor called with baseURL:', baseURL);
    
    this.autoAuth = autoAuth;
    this.tokenManager = GlobalTokenManager.getInstance();
    
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      },
    });

    this.setupInterceptors();
    
    // Subscribe to token changes if auto auth is enabled
    if (this.autoAuth) {
      this.subscribeToTokenChanges();
    }
    
    console.log('✅ ApiClient: Initialization complete');
  }

  private subscribeToTokenChanges(): void {
    this.unsubscribeToken = this.tokenManager.subscribe((token) => {
      console.log('🔄 ApiClient: Token changed, updating default headers');
      this.updateAuthHeader(token);
    });
    
    // Set initial token if available
    const currentToken = this.tokenManager.getToken();
    if (currentToken) {
      this.updateAuthHeader(currentToken);
    }
  }

  private updateAuthHeader(token: string | null): void {
    if (token) {
      this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('🔑 ApiClient: Authorization header updated');
    } else {
      delete this.instance.defaults.headers.common['Authorization'];
      console.log('🚫 ApiClient: Authorization header removed');
    }
  }

  private setupInterceptors(): void {
    console.log('🔧 ApiClient: Setting up interceptors...');
    
    // Request interceptor - add auth token if not already set and auto auth is enabled
    this.instance.interceptors.request.use(
      (config) => {
        const skipAuth = (config as RequestOptions).skipAuth;
        console.log(`📤 Request to ${config.url}, skipAuth: ${skipAuth}, autoAuth: ${this.autoAuth}`);
        
        if (!skipAuth && this.autoAuth) {
          // Only add token if not already present in headers
          if (!config.headers?.Authorization) {
            const token = this.tokenManager.getToken();
            if (token) {
              config.headers = config.headers || {};
              config.headers.Authorization = `Bearer ${token}`;
              console.log('🔑 Request: Added Authorization header from interceptor');
            } else {
              console.log('❌ Request: No token available');
            }
          } else {
            console.log('✅ Request: Authorization header already present');
          }
        } else {
          console.log('⏭️ Request: Skipping auth (skipAuth or autoAuth disabled)');
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

  // HTTP Methods
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
  private async handleLogin<T = any>(credentials: any): Promise<T> {
    console.log('🔐 Login attempt...');
    const response = await this.post<T>(AUTH_ENDPOINTS.POST_SIGN_IN, credentials, { skipAuth: true });
    console.log('✅',response);
    return response;
  }

  async register<T = any>(userData: any): Promise<T> {
    console.log('📝 Register attempt...');
    const response = await this.post<T>('/auth/register', userData, { skipAuth: true });
    console.log('✅ Register successful');
    return response;
  }

  async login(credentials: { email: string; password: string }) {
        try {
            console.log('🔐 SERVER: Attempting login...');
            
            // Login through AUTH_SERVICE
            const response = await this.handleLogin(credentials);
            if (response.userToken.accessToken !== null) {
              if(!TokenManager.hasValidToken(response.userToken.accessToken)){
                  console.error('❌ SERVER: Login failed: Your Account can not access please login by validate account!');
                  throw "Your Account can not access please login by validate account!";
              }
                // 🚨 KEY: Set token globally - tất cả service tự động có token
                TokenManager.setToken(response.userToken.accessToken);
                console.log('✅ SERVER: Login successful, token distributed to all services');
            }
            
            return response;
        } catch (error) {
            console.error('❌ SERVER: Login failed:', error);
            throw error;
        }
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

  // Enable/disable auto auth
  setAutoAuth(enabled: boolean): void {
    console.log('🔧 ApiClient.setAutoAuth() called with:', enabled);
    
    if (enabled && !this.autoAuth) {
      this.autoAuth = true;
      this.subscribeToTokenChanges();
    } else if (!enabled && this.autoAuth) {
      this.autoAuth = false;
      if (this.unsubscribeToken) {
        this.unsubscribeToken();
        this.unsubscribeToken = undefined;
      }
      // Remove auth header
      delete this.instance.defaults.headers.common['Authorization'];
    }
  }

  // Get current configuration
  getConfig(): { baseURL: string; autoAuth: boolean } {
    return {
      baseURL: this.instance.defaults.baseURL || '',
      autoAuth: this.autoAuth
    };
  }

  // Cleanup method
  destroy(): void {
    console.log('🗑️ ApiClient.destroy() called');
    if (this.unsubscribeToken) {
      this.unsubscribeToken();
      this.unsubscribeToken = undefined;
    }
  }

  // Debug method
  debugTokenState(): void {
    console.log('🐛 === API CLIENT DEBUG INFO ===');
    console.log('Base URL:', this.instance.defaults.baseURL);
    console.log('Auto Auth:', this.autoAuth);
    console.log('Authorization Header:', this.instance.defaults.headers.common['Authorization']);
    console.log('Token from GlobalTokenManager:', this.tokenManager.getToken());
    console.log('Has valid token:', this.tokenManager.hasValidToken(null));
    
    try {
      const lsToken = localStorage.getItem('authToken');
      console.log('Token from localStorage:', lsToken);
    } catch (e) {
      console.log('Cannot access localStorage:', e);
    }
    console.log('🐛 === END DEBUG INFO ===');
  }
}

// ==================== STATIC METHODS FOR GLOBAL TOKEN MANAGEMENT ====================
export const TokenManager = {
  setToken: (token: string) => {
    GlobalTokenManager.getInstance().setToken(token);
  },
  
  clearToken: () => {
    GlobalTokenManager.getInstance().clearToken();
  },
  
  getToken: () => {
    return GlobalTokenManager.getInstance().getToken();
  },
  
  hasValidToken: (token: string | null) => {
    return GlobalTokenManager.getInstance().hasValidToken(token);
  },
  getTokenInfo(token: string | null) : any | null {
    return GlobalTokenManager.getInstance().getTokenInfo(token);
  },
  
  refreshFromStorage: () => {
    GlobalTokenManager.getInstance().refreshFromStorage();
  },
  
  subscribe: (callback: (token: string | null) => void) => {
    return GlobalTokenManager.getInstance().subscribe(callback);
  }
};

// ==================== FACTORY FUNCTIONS ====================
export const createApiClient = (config?: ApiClientConfig) => {
  return new ApiClient(config);
};

export const createAuthenticatedClient = (baseURL: string, additionalConfig?: Omit<ApiClientConfig, 'baseURL'>) => {
  return new ApiClient({ 
    baseURL, 
    autoAuth: true,
    ...additionalConfig 
  });
};

export const createUnauthenticatedClient = (baseURL: string, additionalConfig?: Omit<ApiClientConfig, 'baseURL'>) => {
  return new ApiClient({ 
    baseURL, 
    autoAuth: false,
    ...additionalConfig 
  });
};

class SERVER {
    public AUTH_SERVICE: ApiClient;
    public CHAT_SERVICE: ApiClient;
    public NOTIFICATION_SERVICE: ApiClient;
    public USER_SERVICE: ApiClient;
    public TEMP_SERVICE: ApiClient;
    public OUT_SERVICE: ApiClient;

    constructor() {
        console.log('🚀 SERVER: Initializing all services...');
        
        // 🔑 Tạo tất cả service với auto authentication
        this.AUTH_SERVICE = createAuthenticatedClient(BASE_API_AUTH);
        this.CHAT_SERVICE = createAuthenticatedClient(BASE_API_CHAT);
        this.NOTIFICATION_SERVICE = createAuthenticatedClient(BASE_API_NOTIFICATION);
        this.USER_SERVICE = createAuthenticatedClient(BASE_API_USER);
        this.TEMP_SERVICE = createAuthenticatedClient(BASE_API_TEMP);
        this.OUT_SERVICE = createAuthenticatedClient(BASE_API_OUT);
        
        console.log('✅ SERVER: All services initialized with auto token sync');
        
        // 🔄 Optional: Setup token refresh listener
        this.setupTokenRefreshListener();
    }

    // 🔄 Setup listener for token changes
    private setupTokenRefreshListener(): void {
        TokenManager.subscribe((token) => {
            if (token) {
                console.log('🔄 SERVER: Token updated, all services will auto-sync');
            } else {
                console.log('🗑️ SERVER: Token cleared, all services logged out');
            }
        });
    }

    // 🔐 Authentication methods
    async login(credentials: any) {
        try {
            console.log('🔐 SERVER: Attempting login...');
            
            // Login through AUTH_SERVICE
            const response = await this.AUTH_SERVICE.login(credentials);
            
            return response;
        } catch (error) {
            console.error('❌ SERVER: Login failed:', error);
            throw error;
        }
    }

    async logout() {
        try {
            console.log('🚪 SERVER: Logging out...');          
            // 🚨 KEY: Clear token globally - tất cả service tự động mất token
            TokenManager.clearToken();
            
            console.log('✅ SERVER: Logout successful, all services logged out');
        } catch (error) {
            console.error('❌ SERVER: Logout error:', error);
            // Still clear token even if logout request fails
            TokenManager.clearToken();
        }
    }

    async refreshToken() {
        try {
            console.log('🔄 SERVER: Refreshing token...');
            
            const response = await this.AUTH_SERVICE.post('/auth/refresh');
            
            if (response.token) {
                // 🚨 KEY: Update token globally - tất cả service tự động cập nhật
                TokenManager.setToken(response.token);
                console.log('✅ SERVER: Token refreshed, all services updated');
            }
            
            return response;
        } catch (error) {
            console.error('❌ SERVER: Token refresh failed:', error);
            // Clear invalid token
            TokenManager.clearToken();
            throw error;
        }
    }

    // 🔍 Utility methods
    isAuthenticated(): boolean {
        return TokenManager.hasValidToken(null);
    }

    getCurrentToken(): string | null {
        return TokenManager.getToken();
    }
    

    // 🐛 Debug method
    debugAllServices(): void {
        console.log('🐛 === SERVER DEBUG INFO ===');
        console.log('Global Token:', TokenManager.getToken());
        console.log('Is Authenticated:', this.isAuthenticated());
        
        console.log('\n🔍 Service Configurations:');
        console.log('AUTH_SERVICE:', this.AUTH_SERVICE.getConfig());
        console.log('CHAT_SERVICE:', this.CHAT_SERVICE.getConfig());
        console.log('NOTIFICATION_SERVICE:', this.NOTIFICATION_SERVICE.getConfig());
        console.log('USER_SERVICE:', this.USER_SERVICE.getConfig());
        
        console.log('\n🔑 Current Auth Headers:');
        this.AUTH_SERVICE.debugTokenState();
        this.CHAT_SERVICE.debugTokenState();
        this.NOTIFICATION_SERVICE.debugTokenState();
        this.USER_SERVICE.debugTokenState();
        this.OUT_SERVICE.debugTokenState();
        
        console.log('🐛 === END DEBUG INFO ===');
    }

    // 🗑️ Cleanup method
    destroy(): void {
        console.log('🗑️ SERVER: Destroying all services...');
        
        this.AUTH_SERVICE.destroy();
        this.CHAT_SERVICE.destroy();
        this.NOTIFICATION_SERVICE.destroy();
        this.USER_SERVICE.destroy();
        this.OUT_SERVICE.destroy();
        
        console.log('✅ SERVER: All services destroyed');
    }
}

// ==================== EXPORTS ====================
// Default client with BASE_API_URL
export default new SERVER();

// Export types
export type { ApiClient, ApiError, RequestOptions, ApiClientConfig,GlobalTokenManager };