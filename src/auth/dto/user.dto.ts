/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}

export interface UpdateUserDTO {
  name: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface OAuthDTO {
  email: string;
  name: string;
}
