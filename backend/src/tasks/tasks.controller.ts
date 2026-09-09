import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto.js';

import { Roles } from '../auth/roles/roles.decorator.js';
import { RolesGuard } from '../auth/roles/roles.guard.js';

import { Role } from '../users/entities/user.entity.js';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  // Manager creates task
  @Post()
  @Roles(Role.MANAGER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: any,
  ) {
    return this.tasksService.createTask(
      createTaskDto,
      req.user.id,
    );
  }

  // Employee updates task status
  @Patch(':id/status')
  @Roles(Role.EMPLOYEE)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    return this.tasksService.updateTaskStatus(
      Number(id),
      updateTaskStatusDto,
    );
  }

  // for Manager all tasks
  // for Employee only assigned tasks to the employee
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getTasks(@Request() req: any) {
    return this.tasksService.getTasks(
      req.user.id,
      req.user.role,
    );
  }
}