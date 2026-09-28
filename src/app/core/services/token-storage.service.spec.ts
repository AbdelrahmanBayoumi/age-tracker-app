import { TestBed } from '@angular/core/testing';
import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [TokenStorageService],
    });
    service = TestBed.inject(TokenStorageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save and retrieve access and refresh tokens', () => {
    service.saveTokens({ access_token: 'access-123', refresh_token: 'refresh-456' });

    expect(service.getAccessToken()).toBe('access-123');
    expect(service.getRefreshToken()).toBe('refresh-456');
    expect(service.hasTokens()).toBeTrue();
  });

  it('should return false for hasTokens when tokens are missing', () => {
    expect(service.hasTokens()).toBeFalse();

    localStorage.setItem('access_token', 'only-access');
    expect(service.hasTokens()).toBeFalse();
  });

  it('should clear tokens correctly', () => {
    service.saveTokens({ access_token: 'access-123', refresh_token: 'refresh-456' });
    service.clearTokens();

    expect(service.getAccessToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
    expect(service.hasTokens()).toBeFalse();
  });

  it('should save and retrieve user object as parsed JSON', () => {
    const user = { id: 1, email: 'test@example.com', fullName: 'Tester' };
    service.saveUser(user);

    const retrieved = service.getUser<typeof user>();
    expect(retrieved).toEqual(user);
  });

  it('should gracefully handle malformed JSON in localStorage without throwing', () => {
    localStorage.setItem('user', '{invalid json string');

    const result = service.getUser();
    expect(result).toBeNull();
    // And should clear the corrupted entry
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should clear all stored tokens and user data on clearAll', () => {
    service.saveTokens({ access_token: 'access-123', refresh_token: 'refresh-456' });
    service.saveUser({ id: 1 });

    service.clearAll();

    expect(service.getAccessToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
    expect(service.getUser()).toBeNull();
  });
});
