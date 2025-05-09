import React from 'react';
import { Paper, Container, Box, Typography, Button } from '@mui/material';

import { useAuth } from '@/contexts';
import { TaskPage } from '@/components/features/task';

const DashboardForm: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          marginTop: 4,
          padding: 4,
          minHeight: '80vh'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4
          }}
        >
          <Typography variant="h4" component="h1">
            仪表板
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">欢迎, {user?.username}</Typography>
            <Button
              variant="contained"
              color="error"
              onClick={logout}
              sx={{
                textTransform: 'none'
              }}
            >
              退出登录
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            border: '4px dashed',
            borderColor: 'grey.200',
            borderRadius: 2,
            padding: 4,
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <TaskPage />
        </Box>
      </Paper>
    </Container>
  );
};

export default DashboardForm;
