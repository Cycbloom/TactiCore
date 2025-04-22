import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

import { TaskStatus, TaskPriority } from './task.enum';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends CreateTaskDto {
  @ApiProperty({ description: '任务标题', required: false })
  @IsString()
  @IsOptional()
  declare title: string;
}
