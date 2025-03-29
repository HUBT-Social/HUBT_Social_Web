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
    id?: string; // Guid từ C# sẽ map sang string
    userName: string;
    email: string;
    avataUrl: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    fcmToken?: string;
    status?: string;
    //gender: 'Male' | 'Female' | 'Other'; // Enum Gender bên C# cần map lại
    dateOfBirth?: string; // DateTime nên để dạng string ISO (yyyy-mm-dd)
  }