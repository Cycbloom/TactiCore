import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsArray,
  IsNumber,
  IsUUID,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TaskStatus, TaskPriority } from './task.enum';

export class CreateTaskDto {
  @ApiProperty({ description: '任务标题' })
  @IsString()
  title: string;

  @ApiProperty({ description: '任务描述', required: false, nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '任务状态',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    description: '任务优先级',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ description: '优先级分数', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  priorityScore?: number;

  @ApiProperty({ description: '估计工时', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedHours?: number;

  @ApiProperty({ description: '实际工时', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  actualHours?: number;

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

  @ApiProperty({ description: '依赖任务列表', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dependencies?: string[];

  @ApiProperty({ description: '是否紧急', default: false })
  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;

  @ApiProperty({ description: '是否阻塞', default: false })
  @IsBoolean()
  @IsOptional()
  isBlocked?: boolean;
}
