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

export class CreateTaskDto {
  @ApiProperty({ description: '任务标题' })
  @IsString()
  title: string;

  @ApiProperty({ description: '任务描述', required: false, nullable: true })
  @IsString()
  @IsOptional()
  description: string | null;

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
}
