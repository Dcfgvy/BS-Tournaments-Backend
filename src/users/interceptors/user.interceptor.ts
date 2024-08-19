import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { map, Observable } from "rxjs";
import { User } from "src/typeorm/entities/User.entity";

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<User>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map((user: User) => instanceToPlain(user)));
  }
}