import { ApiProperty } from '@nestjs/swagger';

import { TaskStatus, TaskPriority } from './task.enum';

export class TaskResponseDto {
  @ApiProperty({ description: '任务ID' })
  id: string;

  @ApiProperty({ description: '任务标题' })
  title: string;

  @ApiProperty({ description: '任务描述', required: false, nullable: true })
  description: string | null;

  @ApiProperty({ description: '任务状态', enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty({ description: '任务优先级', enum: TaskPriority })
  priority: TaskPriority;

  @ApiProperty({ description: '截止日期', required: false })
  dueDate?: Date;

  @ApiProperty({ description: '标签列表', type: [String], required: false })
  tags?: string[];

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @ApiProperty({ description: '父任务ID', required: false })
  parentId?: string;

  @ApiProperty({
    description: '子任务列表',
    type: () => [TaskResponseDto],
    required: false,
  })
  children?: TaskResponseDto[];

  @ApiProperty({ description: '任务层级', default: 0 })
  level: number;

  @ApiProperty({ description: '同级任务排序', default: 0 })
  order: number;

  @ApiProperty({ description: '任务路径', type: [String] })
  path: string[];
}
