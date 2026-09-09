import { IsEnum } from 'class-validator';
import { TaskStatus } from '../entities/task.entity.js';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}