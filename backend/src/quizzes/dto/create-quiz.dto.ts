import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum QuestionTypeDto {
  BOOLEAN = 'BOOLEAN',
  INPUT = 'INPUT',
  CHECKBOX = 'CHECKBOX',
}

export class CreateOptionDto {
  @IsString()
  text: string;

  @IsBoolean()
  isCorrect: boolean;

  @IsInt()
  @Min(0)
  order: number;
}

export class CreateQuestionDto {
  @IsEnum(QuestionTypeDto)
  type: QuestionTypeDto;

  @IsString()
  prompt: string;

  @IsInt()
  @Min(0)
  order: number;

  // BOOLEAN
  @IsOptional()
  @IsBoolean()
  correctBoolean?: boolean;

  // INPUT
  @IsOptional()
  @IsString()
  correctText?: string;

  // CHECKBOX
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];
}

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
