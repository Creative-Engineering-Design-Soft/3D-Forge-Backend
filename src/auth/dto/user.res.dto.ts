/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
}

export class JwtPayloadResDTO {
  @ApiProperty()
  accessToken: string;
}
