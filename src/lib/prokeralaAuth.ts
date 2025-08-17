// Prokerala API Authentication Service
// Handles OAuth2 token management with automatic refresh

interface ProkeralaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface CachedToken extends ProkeralaTokenResponse {
  expires_at: number; // Unix timestamp
  cached_at: number;  // Unix timestamp
}

class ProkeralaAuth {
  private static instance: ProkeralaAuth;
  private cachedToken: CachedToken | null = null;
  private tokenPromise: Promise<string> | null = null;

  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly tokenUrl: string;

  private constructor() {
    // In production, these should come from environment variables
    this.clientId = import.meta.env.VITE_PROKERALA_CLIENT_ID || '3e82b238-c802-4c86-b4da-ad73035080c2';
    this.clientSecret = import.meta.env.VITE_PROKERALA_CLIENT_SECRET || 'BMWd7vZhqY2ecxtXBPbLI5MYEEsAjUA4u2SyLRp1';
    this.tokenUrl = import.meta.env.VITE_PROKERALA_TOKEN_URL || 'https://api.prokerala.com/token';

    // Load cached token from localStorage on initialization
    this.loadCachedToken();
  }

  public static getInstance(): ProkeralaAuth {
    if (!ProkeralaAuth.instance) {
      ProkeralaAuth.instance = new ProkeralaAuth();
    }
    return ProkeralaAuth.instance;
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  public async getAccessToken(): Promise<string> {
    // If we already have a request in flight, wait for it
    if (this.tokenPromise) {
      return this.tokenPromise;
    }

    // Check if we have a valid cached token
    if (this.isTokenValid()) {
      return this.cachedToken!.access_token;
    }

    // Need to fetch a new token
    this.tokenPromise = this.fetchNewToken();
    
    try {
      const token = await this.tokenPromise;
      return token;
    } finally {
      this.tokenPromise = null;
    }
  }

  /**
   * Check if the current cached token is still valid
   */
  private isTokenValid(): boolean {
    if (!this.cachedToken) {
      return false;
    }

    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    
    return now < (this.cachedToken.expires_at - bufferTime);
  }

  /**
   * Fetch a new token from Prokerala API
   */
  private async fetchNewToken(): Promise<string> {
    try {
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
      }

      const tokenData: ProkeralaTokenResponse = await response.json();
      
      // Cache the token with expiration
      const now = Date.now();
      this.cachedToken = {
        ...tokenData,
        expires_at: now + (tokenData.expires_in * 1000),
        cached_at: now,
      };

      // Save to localStorage for persistence
      this.saveCachedToken();

      console.log('✅ Prokerala token refreshed successfully');
      return tokenData.access_token;

    } catch (error) {
      console.error('❌ Failed to fetch Prokerala token:', error);
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load cached token from localStorage
   */
  private loadCachedToken(): void {
    try {
      const stored = localStorage.getItem('prokerala_token');
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Validate the stored token structure
        if (this.isValidTokenStructure(parsed)) {
          this.cachedToken = parsed;
          console.log('📱 Loaded cached Prokerala token');
        } else {
          console.warn('⚠️ Invalid cached token structure, will fetch new token');
          localStorage.removeItem('prokerala_token');
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to load cached token:', error);
      localStorage.removeItem('prokerala_token');
    }
  }

  /**
   * Save current token to localStorage
   */
  private saveCachedToken(): void {
    if (this.cachedToken) {
      try {
        localStorage.setItem('prokerala_token', JSON.stringify(this.cachedToken));
      } catch (error) {
        console.warn('⚠️ Failed to save token to localStorage:', error);
      }
    }
  }

  /**
   * Validate token structure
   */
  private isValidTokenStructure(token: any): token is CachedToken {
    return (
      token &&
      typeof token.access_token === 'string' &&
      typeof token.token_type === 'string' &&
      typeof token.expires_in === 'number' &&
      typeof token.expires_at === 'number' &&
      typeof token.cached_at === 'number'
    );
  }

  /**
   * Clear cached token (useful for logout or errors)
   */
  public clearCache(): void {
    this.cachedToken = null;
    localStorage.removeItem('prokerala_token');
    console.log('🗑️ Prokerala token cache cleared');
  }

  /**
   * Get token info for debugging
   */
  public getTokenInfo(): { 
    hasToken: boolean; 
    isValid: boolean; 
    expiresAt?: Date; 
    cachedAt?: Date; 
  } {
    if (!this.cachedToken) {
      return { hasToken: false, isValid: false };
    }

    return {
      hasToken: true,
      isValid: this.isTokenValid(),
      expiresAt: new Date(this.cachedToken.expires_at),
      cachedAt: new Date(this.cachedToken.cached_at),
    };
  }

  /**
   * Make authenticated request to Prokerala API
   */
  public async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getAccessToken();
    
    const authenticatedOptions: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, authenticatedOptions);

    // If we get a 401, the token might be invalid - clear cache and retry once
    if (response.status === 401 && this.cachedToken) {
      console.warn('⚠️ Received 401, clearing token cache and retrying...');
      this.clearCache();
      
      // Retry with fresh token
      const newToken = await this.getAccessToken();
      authenticatedOptions.headers = {
        ...authenticatedOptions.headers,
        'Authorization': `Bearer ${newToken}`,
      };
      
      return fetch(url, authenticatedOptions);
    }

    return response;
  }
}

// Export singleton instance
export const prokeralaAuth = ProkeralaAuth.getInstance();

// Export types for external use
export type { ProkeralaTokenResponse, CachedToken }; 