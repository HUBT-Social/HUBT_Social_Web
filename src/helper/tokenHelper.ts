import {UserToken,LoginResponse} from '../types/user'


// Hàm để lưu token vào localStorage
const saveTokensToLocalStorage = (userToken: UserToken) => {
  localStorage.setItem('accessToken', userToken.accessToken);
  localStorage.setItem('refreshToken', userToken.refreshToken);
  localStorage.setItem('expiresIn', JSON.stringify(userToken.expiresIn)); // Lưu số dưới dạng string
  localStorage.setItem('tokenType', userToken.tokenType);
};
// Hàm để xóa token khỏi localStorage (khi đăng xuất)
const clearTokensFromLocalStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('tokenType');
  };
// Ví dụ sử dụng khi bạn nhận được LoginResponse
export  const handleLoginSuccess = (response: LoginResponse) => {
  localStorage.setItem('user', JSON.stringify(response));
  saveTokensToLocalStorage(response.userToken);
  console.log('Đăng nhập thành công, token đã được lưu.');
};
export  const handleLogout = () => {
    localStorage.removeItem('user');
    clearTokensFromLocalStorage();
    console.log('Đăng thành công, token đã được xoa.');
}

// Hàm để lấy token từ localStorage (nếu cần)
export const getTokensFromLocalStorage = (): UserToken | null => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const expiresInStr = localStorage.getItem('expiresIn');
  const tokenType = localStorage.getItem('tokenType');

  if (accessToken && refreshToken && expiresInStr && tokenType) {
    const expiresIn = parseInt(expiresInStr, 10);
    return { accessToken, refreshToken, expiresIn, tokenType };
  }

  return null;
};
export const userFromStorage = localStorage.getItem('user');


export const storageService = {
  getItem: (key: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
  clear: () => {
    localStorage.clear();
  }
};
