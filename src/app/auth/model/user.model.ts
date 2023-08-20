export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export class User {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public brithday: string,
    public isVerified: boolean,
    private _token: Tokens,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
