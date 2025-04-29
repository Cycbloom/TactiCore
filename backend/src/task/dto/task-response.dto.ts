import { ApiProperty } from '@nestjs/swagger';

import { TaskStatus, TaskPriority } from './task.enum';

export class TaskResponseDto {
  @ApiProperty({ description: '任务ID' })
  id: string;

  @ApiProperty({ description: '任务标题' })
  title: string;

  @ApiProperty({ description: '任务描述', required: false, nullable: true })
  description?: string;

  @ApiProperty({ description: '任务状态', enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty({ description: '任务优先级', enum: TaskPriority })
  priority: TaskPriority;

  @ApiProperty({ minimum: 0, maximum: 100 })
  priorityScore: number;

  @ApiProperty({ required: false, minimum: 0 })
  estimatedHours?: number;

  @ApiProperty({ required: false, minimum: 0 })
  actualHours?: number;

  @ApiProperty({ required: false })
  dueDate?: Date;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  parentId?: string;

  @ApiProperty({ type: [String] })
  path: string[];

  @ApiProperty({
    description: '子任务列表',
    type: () => [TaskResponseDto],
    required: false,
  })
  children?: TaskResponseDto[];

  @ApiProperty()
  order: number;

  @ApiProperty()
  isRoot: boolean;

  @ApiProperty({ required: false })
  lastPostponed?: Date;

  @ApiProperty()
  postponeCount: number;

  @ApiProperty()
  isUrgent: boolean;

  @ApiProperty({ type: [String] })
  dependencies: string[];

  @ApiProperty()
  isBlocked: boolean;
}
