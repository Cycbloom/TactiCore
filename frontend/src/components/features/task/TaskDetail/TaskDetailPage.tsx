import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  Divider,
  Grid,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Save as SaveIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

import { taskApi } from '@/services/api/taskApi';
import { Task } from '@/types/task';

const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (!taskId) return;
        const data = await taskApi.getTask(taskId);
        setTask(data);
      } catch (err) {
        setError('获取任务详情失败');
        console.error('获取任务详情失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !task) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Typography color="error">{error || '任务不存在'}</Typography>
      </Box>
    );
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '未设置';
    try {
      return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
    } catch (e) {
      return '日期格式错误';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', py: 2 }}>
      {/* 顶部标题栏 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h5" sx={{ flexGrow: 1, ml: 2 }}>
          {task.title}
        </Typography>
        <IconButton>
          <EditIcon />
        </IconButton>
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* 主要内容区域 */}
      <Box sx={{ display: 'flex', height: 'calc(100% - 80px)' }}>
        {/* 左侧面板 */}
        <Paper
          elevation={2}
          sx={{
            width: leftPanelOpen ? '300px' : '40px',
            transition: 'width 0.3s',
            overflow: 'hidden',
            display: isMobile ? 'none' : 'block'
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">基本信息</Typography>
              <IconButton onClick={() => setLeftPanelOpen(!leftPanelOpen)}>
                {leftPanelOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Box>
            {leftPanelOpen && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    状态
                  </Typography>
                  <Typography variant="body1">{task.status}</Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    优先级
                  </Typography>
                  <Typography variant="body1">{task.priority}</Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    截止日期
                  </Typography>
                  <Typography variant="body1">{formatDate(task.dueDate)}</Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    创建时间
                  </Typography>
                  <Typography variant="body1">{formatDate(task.createdAt)}</Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    更新时间
                  </Typography>
                  <Typography variant="body1">{formatDate(task.updatedAt)}</Typography>
                </Box>
              </>
            )}
          </Box>
        </Paper>

        {/* 中间工作区 */}
        <Paper
          elevation={2}
          sx={{
            flexGrow: 1,
            mx: 2,
            p: 2,
            overflow: 'auto'
          }}
        >
          <Typography variant="h6" gutterBottom>
            笔记
          </Typography>
          <Box sx={{ minHeight: '200px' }}>{/* 这里将放置富文本编辑器 */}</Box>
        </Paper>

        {/* 右侧面板 */}
        <Paper
          elevation={2}
          sx={{
            width: rightPanelOpen ? '300px' : '40px',
            transition: 'width 0.3s',
            overflow: 'hidden',
            display: isMobile ? 'none' : 'block'
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">时间管理</Typography>
              <IconButton onClick={() => setRightPanelOpen(!rightPanelOpen)}>
                {rightPanelOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Box>
            {rightPanelOpen && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    时钟
                  </Typography>
                  <Typography variant="h4">12:00:00</Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    倒计时
                  </Typography>
                  <Typography variant="h4">00:30:00</Typography>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Box>

      {/* 底部操作栏 */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          p: 1
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <IconButton>
            <AddIcon />
          </IconButton>
          <IconButton>
            <HistoryIcon />
          </IconButton>
          <IconButton>
            <DownloadIcon />
          </IconButton>
          <IconButton>
            <SaveIcon />
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
};

export default TaskDetailPage;
