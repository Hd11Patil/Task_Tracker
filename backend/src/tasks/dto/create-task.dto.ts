import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  dueDate: string;

  @IsNumber()
  assignedTo: number;
}