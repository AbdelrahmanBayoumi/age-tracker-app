export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export class User {
  constructor(
    public id: number,
    public email: string,
    public fullName: string,
    public birthday: string,
    public isVerified: boolean,
    public tokens: Tokens,
    public image: string
  ) {}
}
