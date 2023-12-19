export declare interface LoginGetSMSCodeRequest {
  phone: string;
}

export declare interface LoginGetSMSCodeResponse {
  userId: string;
  expireTime: number;
  smsCode: string;
}

export declare interface LoginRequest {
  smsCode: string;
  userAgent?: string;
  ip?: string;
  userId: string;
}

export declare interface LoginResponse{
  accessToken: string;
  refreshToken: string; 
}

export declare interface LoginForAdminRequest {
  username: string;
  password: string;
  userAgent?: string;
  ip?: string;
}

export declare interface LoginForAdminResponse {
  accessToken: string;
  refreshToken: string;
}