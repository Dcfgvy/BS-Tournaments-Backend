import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Roles = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number[] => {
    const request = ctx.switchToHttp().getRequest();
    const user = request['user'];

    if (user && user.roles) {
      return user.roles;
    }
    
    return [];
  },
);
