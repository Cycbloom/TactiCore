import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

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
}

export class UpdateTaskDto extends CreateTaskDto {
  // id 字段从 URL 参数中获取，不需要在请求体中
}

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

export class TaskFilterDto {
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
}
