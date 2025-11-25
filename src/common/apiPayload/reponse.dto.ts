import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiProperty,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

export class ResponseDTO<T = any> {
  @ApiProperty({ example: 200 })
  status: HttpStatus;
  @ApiProperty({ example: 'OK200' })
  code: string;
  @ApiProperty({ example: 'OK' })
  message: string;
  @ApiProperty({ type: () => Object })
  result: T;
}

export const ApiResponseType = <TModel extends Type<any>>(
  model: TModel,
  status = 200,
) => {
  return applyDecorators(
    ApiExtraModels(ResponseDTO, model),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDTO) },
          {
            properties: {
              result: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};

export const ApiResponseArrayType = <TModel extends Type<any>>(
  model: TModel,
  status = 200,
  isArray = false,
) => {
  return applyDecorators(
    ApiExtraModels(ResponseDTO, model),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDTO) },
          {
            properties: {
              result: isArray
                ? { type: 'array', items: { $ref: getSchemaPath(model) } }
                : { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};
