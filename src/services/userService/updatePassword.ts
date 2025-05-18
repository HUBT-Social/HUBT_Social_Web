import axios from 'axios';

export interface UpdatePasswordRequest {
  userName?: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const updatePasswordAsync = async (
  data: UpdatePasswordRequest
): Promise<boolean> => {
  try {
    const res = await axios.post(
      'https://localhost:7208/api/identity/user/change-password',
      data
    );

    return res.status === 200;
  } catch (error) {
    console.error("Password update failed:", error);
    return false;
  }
};