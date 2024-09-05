import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { UserRole } from '../enums/role.enum';

@Injectable()
export class OrganizerGuard implements CanActivate {
  constructor(
    private authService: AuthService
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.authService.validateRequestByRole(request, UserRole.ORGANIZER);
  }
}