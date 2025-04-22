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
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { TaskService } from './task.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponseDto,
  TaskFilterDto,
} from './dto';

import { JwtAuthGuard } from '@/core/auth/guards/jwt-auth.guard';

@ApiTags('任务')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: '创建任务' })
  @ApiResponse({
    status: 201,
    description: '任务创建成功',
    type: TaskResponseDto,
  })
  create(@Body() createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    return this.taskService.createTask(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: '获取任务列表' })
  @ApiResponse({
    status: 200,
    description: '获取任务列表成功',
    type: [TaskResponseDto],
  })
  findAll(@Query() filter: TaskFilterDto): Promise<TaskResponseDto[]> {
    return this.taskService.getTasks(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取任务详情' })
  @ApiResponse({
    status: 200,
    description: '获取任务详情成功',
    type: TaskResponseDto,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TaskResponseDto> {
    return this.taskService.getTask(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新任务' })
  @ApiResponse({
    status: 200,
    description: '任务更新成功',
    type: TaskResponseDto,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除任务' })
  @ApiResponse({
    status: 200,
    description: '任务删除成功',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.taskService.deleteTask(id);
  }

  @Get(':id/children')
  @ApiOperation({ summary: '获取子任务列表' })
  @ApiResponse({
    status: 200,
    description: '获取子任务列表成功',
    type: [TaskResponseDto],
  })
  getChildren(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TaskResponseDto[]> {
    return this.taskService.getTaskChildren(id);
  }

  @Post(':id/children')
  @ApiOperation({ summary: '创建子任务' })
  @ApiResponse({
    status: 201,
    description: '子任务创建成功',
    type: TaskResponseDto,
  })
  createChild(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.createTask({ ...createTaskDto, parentId: id });
  }

  @Patch(':id/order')
  @ApiOperation({ summary: '更新任务顺序' })
  @ApiResponse({
    status: 200,
    description: '任务顺序更新成功',
    type: TaskResponseDto,
  })
  updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('order') order: number,
  ): Promise<TaskResponseDto> {
    return this.taskService.updateTask(id, { order });
  }
}
