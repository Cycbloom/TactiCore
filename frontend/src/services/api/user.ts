import request from './request';

export interface UserData {
  id: string;
  username: string;
  email: string;
}

export const userApi = {
  // 获取用户信息
  getUserInfo: (userId: string) => {
    return request.get<UserData>(`/users/${userId}`);
  },

  // 更新用户信息
  updateUserInfo: (userId: string, data: Partial<UserData>) => {
    return request.put<UserData>(`/users/${userId}`, data);
  },

  // 用户登录
  login: (username: string, password: string) => {
    return request.post<{ token: string }>('/auth/login', {
      username,
      password
    });
  },

  // 用户注册
  register: (userData: Omit<UserData, 'id'> & { password: string }) => {
    return request.post<UserData>('/auth/register', userData);
  }
};
