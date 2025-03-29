import { getTokensFromLocalStorage } from "./tokenHelper";

type TokenInfo = {
  username: string;
  email: string;
  roles: string[];
  tokenId: string;
  userId: string;
  issuedAt: Date;
  expiresAt: Date;
  isExpired: boolean;
};

export const extractTokenInfo = (): TokenInfo | null => {
  try {
    const token = getTokensFromLocalStorage();

    const base64Url = token?.accessToken.split('.')[1];
    if (!base64Url) throw new Error('Invalid token');

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );

    const data = JSON.parse(jsonPayload);

    const now = Date.now() / 1000; // seconds

    return {
      username: data.unique_name,
      email: data.email,
      roles: Array.isArray(data.role) ? data.role : [data.role],
      tokenId: data.jti,
      userId: data.nameid,
      issuedAt: new Date(data.iat * 1000),
      expiresAt: new Date(data.exp * 1000),
      isExpired: now >= data.exp,
    };
  } catch (error) {
    console.error('❌ Error extracting token info:', error);
    return null;
  }
};
