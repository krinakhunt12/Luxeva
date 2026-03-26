export interface User {
  id?: string;
  name: string;
  email: string;
  mobile?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  mobile?: string;
}
