import { createParamDecorator } from '@nestjs/common';
import { PaginationParamsDto } from './pagination.dto';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

export const PaginationParams = createParamDecorator((data, req: ExecutionContextHost) => {
  const requestData = req.getArgs()[0];
  const result = new PaginationParamsDto();
  result.page = Number(requestData.query.page) || 1;
  result.limit = Number(requestData.query.limit) || 10;
  return result;
});