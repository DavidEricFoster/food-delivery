class TokenStorage {
    private readonly TOKEN_KEY = 'auth_token';

    setTokens(token: string, expiresIn: number): void {
        const expiresAt = Date.now() + expiresIn * 1000;

        sessionStorage.setItem(this.TOKEN_KEY, token);
        sessionStorage.setItem('token_expires', expiresAt.toString());
    }

    getToken(): string | null {
        const token = sessionStorage.getItem(this.TOKEN_KEY);
        
        if (!token) return null;
        if (this.isTokenExpired()) {
            this.clearTokens();
            return null;
        }
        return token;
    }

    clearTokens(): void {
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem('token_expires');
    }

    isTokenExpired(): boolean {
        const expires = sessionStorage.getItem('token_expires');
        return !expires || Date.now() > parseInt(expires);
    }
}

export const tokenStorage = new TokenStorage();
