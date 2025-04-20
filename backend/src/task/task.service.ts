import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponseDto,
  TaskFilterDto,
  TaskStatus,
  TaskPriority,
} from '@/task/task.schema';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  private convertToTaskResponseDto(task: any): TaskResponseDto {
    return {
      ...task,
      status: task.status as TaskStatus,
      priority: task.priority as TaskPriority,
    };
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        status: createTaskDto.status || TaskStatus.TODO,
        priority: createTaskDto.priority || TaskPriority.MEDIUM,
      },
    });
    return this.convertToTaskResponseDto(task);
  }

  async getTasks(filter: TaskFilterDto): Promise<TaskResponseDto[]> {
    const where = {
      ...(filter.status && { status: filter.status }),
      ...(filter.priority && { priority: filter.priority }),
      ...(filter.tags && { tags: { hasSome: filter.tags } }),
      ...(filter.startDate && { dueDate: { gte: filter.startDate } }),
      ...(filter.endDate && { dueDate: { lte: filter.endDate } }),
      ...(filter.search && {
        OR: [
          { title: { contains: filter.search, mode: 'insensitive' as const } },
          {
            description: {
              contains: filter.search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
    };

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return tasks.map((task) => this.convertToTaskResponseDto(task));
  }

  async getTask(id: string): Promise<TaskResponseDto> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.convertToTaskResponseDto(task);
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });

    return this.convertToTaskResponseDto(updatedTask);
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.prisma.task.delete({
      where: { id },
    });
  }
}
