import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskPriority, TaskStatus } from './entities/task.entity.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { NotFoundException } from '@nestjs/common';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  //in this i validate due date
  validateDueDate(dueDate: string) {
    const selectedDate = new Date(dueDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      throw new BadRequestException('Due date cannot be in the past');
    }
  }

  //in this calculate the priority days based on due date
  calculatePriority(dueDate: string) {
    const today = new Date();
    const due = new Date(dueDate);

    const differenceInTime = due.getTime() - today.getTime();

    const daysRemaining = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 2) {
      return TaskPriority.HIGH;
    }
    if (daysRemaining <= 5) {
      return TaskPriority.MEDIUM;
    }
    return TaskPriority.LOW;
  }

  //here is create task logic
  async createTask(createTaskDto: CreateTaskDto, managerId: number) {
    this.validateDueDate(createTaskDto.dueDate);

    const priority = this.calculatePriority(createTaskDto.dueDate);

    const task = this.taskRepository.create({
      title: createTaskDto.title,
      dueDate: new Date(createTaskDto.dueDate),
      assignedTo: createTaskDto.assignedTo,
      createdBy: managerId,
      status: TaskStatus.PENDING,
      priority,
    });

    return this.taskRepository.save(task);
  }

  //this validate the task status changes

  validateStatusTransition(currentStatus: TaskStatus, newStatus: TaskStatus) {
    if (currentStatus === TaskStatus.PENDING && newStatus === TaskStatus.DONE) {
      throw new BadRequestException(
        'Pending task cannot be marked directly as Done',
      );
    }

    if (currentStatus === TaskStatus.DONE && newStatus !== TaskStatus.DONE) {
      throw new BadRequestException('Completed task status cannot be changed');
    }
  }

  //this is update the task status api
  async updateTaskStatus(
    taskId: number,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    this.validateStatusTransition(task.status, updateTaskStatusDto.status);

    // Assignment rule:
    // Task cannot be marked Done after due date
    if (
      updateTaskStatusDto.status === TaskStatus.DONE &&
      new Date() > new Date(task.dueDate)
    ) {
      throw new BadRequestException(
        'Task cannot be marked Done after due date',
      );
    }

    task.status = updateTaskStatusDto.status;

    return this.taskRepository.save(task);
  }

  // role based task list
  async getTasks(userId: number, role: string) {
    if (role === 'manager') {
      return this.taskRepository.find();
    }

    return this.taskRepository.find({
      where: {
        assignedTo: userId,
      },
    });
  }
}
