import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { TaskService } from './task.service';

import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponseDto,
  TaskFilterDto,
} from '@/task/task.schema';
import { JwtAuthGuard } from '@/core/auth/guards/jwt-auth.guard';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: '创建新任务' })
  @ApiResponse({
    status: 201,
    description: '任务创建成功',
    type: TaskResponseDto,
  })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.createTask(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: '获取任务列表' })
  @ApiResponse({
    status: 200,
    description: '返回任务列表',
    type: [TaskResponseDto],
  })
  async getTasks(@Query() filter: TaskFilterDto): Promise<TaskResponseDto[]> {
    return this.taskService.getTasks(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取任务详情' })
  @ApiResponse({
    status: 200,
    description: '返回任务详情',
    type: TaskResponseDto,
  })
  async getTask(@Param('id') id: string): Promise<TaskResponseDto> {
    return this.taskService.getTask(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新任务' })
  @ApiResponse({
    status: 200,
    description: '任务更新成功',
    type: TaskResponseDto,
  })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除任务' })
  @ApiResponse({ status: 200, description: '任务删除成功' })
  async deleteTask(@Param('id') id: string): Promise<void> {
    return this.taskService.deleteTask(id);
  }
}
