import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsArray,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TaskStatus, TaskPriority } from './task.enum';

export class UpdateTaskDto {
  @ApiProperty({ description: '任务标题', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: '任务描述', required: false, nullable: true })
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiProperty({
    description: '任务状态',
    enum: TaskStatus,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    description: '任务优先级',
    enum: TaskPriority,
    required: false,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ description: '截止日期', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ description: '标签列表', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: '父任务ID', required: false })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiProperty({ description: '任务层级', required: false })
  @IsNumber()
  @IsOptional()
  level?: number;

  @ApiProperty({ description: '同级任务排序', required: false })
  @IsNumber()
  @IsOptional()
  order?: number;
}
