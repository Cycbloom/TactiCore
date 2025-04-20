import { useState } from 'react';
import { Paper, Container, Alert, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { BaseForm } from '@/components/common/forms';
import { FormInput } from '@/components/common/form-controls';
import { useAuth } from '@/contexts';

// 定义登录表单的验证模式
const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(6, '密码至少需要6个字符')
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: LoginFormData) => {
    setError('');
    setLoading(true);

    try {
      await login(data);
      onSuccess?.();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <BaseForm<LoginFormData>
          onSubmit={handleSubmit}
          defaultValues={{
            username: '',
            password: ''
          }}
          formTitle="登录到 TactiCore"
          schema={loginSchema}
          submitButtonText={loading ? '登录中...' : '登录'}
          resetAfterSubmit={false}
        >
          <Box sx={{ width: '100%' }}>
            <FormInput
              name="username"
              label="用户名"
              autoComplete="username"
              autoFocus
              disabled={loading}
            />
            <FormInput
              name="password"
              label="密码"
              type="password"
              autoComplete="current-password"
              disabled={loading}
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>
        </BaseForm>
      </Paper>
    </Container>
  );
};

export default LoginForm;
