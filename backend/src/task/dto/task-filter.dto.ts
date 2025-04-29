import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TaskStatus, TaskPriority } from './task.enum';

export class TaskFilterDto {
  @ApiProperty({ description: '搜索关键词', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: '任务状态', enum: TaskStatus, required: false })
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

  @ApiProperty({ description: '标签列表', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: '开始日期', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: '结束日期', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;

  @IsBoolean()
  @IsOptional()
  isBlocked?: boolean;
}
