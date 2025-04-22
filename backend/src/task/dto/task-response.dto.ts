import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDate, IsUUID } from 'class-validator';

import { TaskStatus, TaskPriority } from './task.enum';
import { CreateTaskDto } from './create-task.dto';

export class TaskResponseDto extends CreateTaskDto {
  @ApiProperty({ description: '任务ID' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: '任务描述', required: false, nullable: true })
  @IsString()
  @IsOptional()
  declare description: string | null;

  @ApiProperty({
    description: '任务状态',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  declare status: TaskStatus;

  @ApiProperty({ description: '创建时间' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @IsDate()
  updatedAt: Date;
}
