import { Injectable } from '@angular/core';

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

/**
 * Centralized service for managing authentication tokens in localStorage.
 * Replaces scattered localStorage calls in auth.service.ts.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';

  saveTokens(tokens: Tokens): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access_token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh_token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }

  saveUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser<T>(): T | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  clearAll(): void {
    this.clearTokens();
    this.clearUser();
  }
}
