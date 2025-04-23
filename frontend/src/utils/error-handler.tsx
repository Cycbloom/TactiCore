import React, { useState, ReactNode } from 'react';
import { AxiosError } from 'axios';
import { Snackbar, Alert } from '@mui/material';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  details?: any;
  timestamp: string;
  path: string;
  method: string;
}

// 错误消息映射
const errorMessages: Record<string, string> = {
  'Business Error': '操作失败',
  'Not Found': '资源不存在',
  'Validation Error': '数据验证失败',
  Unauthorized: '未授权访问',
  Forbidden: '没有权限'
};

// 获取友好的错误消息
const getFriendlyMessage = (error: ErrorResponse): string => {
  // 如果是数据库错误，提取有用的信息
  if (error.details?.error?.includes('Invalid `prisma')) {
    const dbError = error.details.error;
    if (dbError.includes('does not exist')) {
      return '数据库操作失败：相关资源不存在';
    }
    if (dbError.includes('Unique constraint')) {
      return '数据已存在，请勿重复创建';
    }
    return '数据库操作失败，请稍后重试';
  }

  // 如果是业务错误，使用预定义的消息
  if (errorMessages[error.error]) {
    return `${errorMessages[error.error]}：${error.message}`;
  }

  // 如果有详细信息，显示详细信息
  if (error.details) {
    if (typeof error.details === 'string') {
      return error.details;
    }
    if (error.details.reason) {
      return error.details.reason;
    }
  }

  // 默认返回原始消息
  return error.message || '操作失败，请稍后重试';
};

// 创建一个全局的错误提示状态
let showError: (message: string) => void;

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  showError = (msg: string) => {
    setMessage(msg);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const errorResponse = error.response?.data as ErrorResponse;

    if (errorResponse) {
      // 显示友好的错误信息
      const friendlyMessage = getFriendlyMessage(errorResponse);
      showError(friendlyMessage);

      // 开发环境下打印详细信息
      if (process.env.NODE_ENV === 'development') {
        console.group('API Error Details');
        console.error('Status:', errorResponse.statusCode);
        console.error('Path:', errorResponse.path);
        console.error('Method:', errorResponse.method);
        console.error('Time:', errorResponse.timestamp);
        console.error('Error Type:', errorResponse.error);
        if (errorResponse.details) {
          console.error('Details:', errorResponse.details);
        }
        console.groupEnd();
      }
    } else {
      // 网络错误
      if (error.code === 'ECONNABORTED') {
        showError('请求超时，请检查网络连接');
      } else if (!error.response) {
        showError('网络连接失败，请检查网络设置');
      } else {
        showError('请求失败，请稍后重试');
      }
    }
  } else {
    // 非 HTTP 错误
    showError('发生未知错误，请稍后重试');
    if (process.env.NODE_ENV === 'development') {
      console.error('Unknown error:', error);
    }
  }
};

export const isAxiosError = (error: unknown): error is AxiosError => {
  return error instanceof AxiosError;
};

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const errorResponse = error.response?.data as ErrorResponse;
    if (errorResponse) {
      return getFriendlyMessage(errorResponse);
    }
    return '网络请求失败，请稍后重试';
  }
  return '发生未知错误，请稍后重试';
};
