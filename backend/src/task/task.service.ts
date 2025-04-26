import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';

import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponseDto,
  TaskFilterDto,
  TaskStatus,
  TaskPriority,
} from './dto';

import { PrismaService } from '@/database/prisma.service';
import {
  BusinessException,
  ValidationException,
} from '@/core/exceptions/business.exception';

@Injectable()
export class TaskService implements OnModuleInit {
  private readonly ROOT_TASK_ID = '00000000-0000-0000-0000-000000000000';

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // 确保根任务存在
    const rootTask = await this.prisma.task.findUnique({
      where: { id: this.ROOT_TASK_ID },
    });

    if (!rootTask) {
      await this.prisma.task.create({
        data: {
          id: this.ROOT_TASK_ID,
          title: 'Root Task',
          description: 'Root task for all tasks',
          status: TaskStatus.COMPLETED,
          priority: TaskPriority.MEDIUM,
          path: [],
          isRoot: true,
        },
      });
    }
  }

  private convertToTaskResponseDto(task: any): TaskResponseDto {
    return {
      ...task,
      status: task.status as TaskStatus,
      priority: task.priority as TaskPriority,
      children: task.children?.map((child) =>
        this.convertToTaskResponseDto(child),
      ),
    };
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    try {
      const parentId = createTaskDto.parentId || this.ROOT_TASK_ID;

      if (parentId !== this.ROOT_TASK_ID) {
        const parentTask = await this.prisma.task.findUnique({
          where: { id: parentId },
        });

        if (!parentTask) {
          throw new NotFoundException(
            `Parent task with ID ${parentId} not found`,
          );
        }

        if (parentTask.path.length > 3) {
          throw new ValidationException('任务层级不能超过4层', {
            currentLevel: parentTask.path.length,
            maxLevel: 3,
          });
        }
      }

      const siblingTasks = await this.prisma.task.count({
        where: { parentId },
      });

      const task = await this.prisma.task.create({
        data: {
          ...createTaskDto,
          parentId,
          status: createTaskDto.status || TaskStatus.TODO,
          priority: createTaskDto.priority || TaskPriority.MEDIUM,
          order: siblingTasks,
        },
        include: {
          children: true,
        },
      });
      return this.convertToTaskResponseDto(task);
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      throw new BusinessException('创建任务失败', { error: error.message });
    }
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
      parentId: this.ROOT_TASK_ID,
      isRoot: false,
    };

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        children: {
          orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
          include: {
            children: true,
          },
        },
      },
    });
    return tasks.map((task) => this.convertToTaskResponseDto(task));
  }

  async getTask(id: string): Promise<TaskResponseDto> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
          include: {
            children: true,
          },
        },
      },
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
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
        include: { children: true },
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      if (
        updateTaskDto.parentId !== undefined &&
        updateTaskDto.parentId !== task.parentId
      ) {
        const newParentId = updateTaskDto.parentId || this.ROOT_TASK_ID;

        if (newParentId !== this.ROOT_TASK_ID) {
          const parentTask = await this.prisma.task.findUnique({
            where: { id: newParentId },
          });

          if (!parentTask) {
            throw new NotFoundException(
              `Parent task with ID ${newParentId} not found`,
            );
          }

          if (await this.wouldCreateCycle(id, newParentId)) {
            throw new BusinessException('不能创建循环依赖关系');
          }

          if (parentTask.path.length > 3) {
            throw new ValidationException('任务层级不能超过4层', {
              currentLevel: parentTask.path.length,
              maxLevel: 3,
            });
          }
        }

        updateTaskDto.parentId = newParentId;
      }

      const updatedTask = await this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
        include: {
          children: {
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
            include: {
              children: true,
            },
          },
        },
      });

      return this.convertToTaskResponseDto(updatedTask);
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      throw new BusinessException('更新任务失败', { error: error.message });
    }
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (task.isRoot) {
      throw new BusinessException('不能删除根任务');
    }

    await this.prisma.task.delete({
      where: { id },
    });
  }

  private async wouldCreateCycle(
    taskId: string,
    newParentId: string,
  ): Promise<boolean> {
    let currentId = newParentId;
    const visited = new Set<string>();

    while (currentId) {
      if (currentId === taskId) {
        return true;
      }

      if (visited.has(currentId)) {
        return true;
      }

      visited.add(currentId);

      const parent = await this.prisma.task.findUnique({
        where: { id: currentId },
        select: { parentId: true },
      });

      if (!parent) {
        break;
      }

      if (!parent.parentId) break;
      currentId = parent.parentId;
    }

    return false;
  }

  async getTaskChildren(id: string): Promise<TaskResponseDto[]> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
          include: {
            children: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task.children.map((child) => this.convertToTaskResponseDto(child));
  }
}
