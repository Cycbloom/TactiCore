import request from './request';
import { UserData } from './user';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export const authApi = {
  // 用户登录
  login: (data: LoginData) => {
    return request.post<LoginResponse>('/auth/login', data);
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return request.get<UserData>('/users/me');
  }
};
