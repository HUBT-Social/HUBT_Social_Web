export interface UserToken {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  }
  
  export interface LoginResponse {
    userToken: UserToken;
    maskEmail: string;
    message: string;
    requiresTwoFactor: boolean;
  }


  export interface UserInfo {
    id: string; 
    userName: string;
    email: string | null;
    avataUrl: string;
    phoneNumber: string | null;
    firstName: string;
    lastName: string;
    fcmToken: string;
    status: string;
    gender: number; // Enum Gender bên C# cần map lại
    dateOfBirth?: string; // DateTime nên để dạng string ISO (yyyy-mm-dd)
    className: string | null;
  }