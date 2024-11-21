import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.query.accessToken as string;

    try {
      const user = await this.jwtService.verifyAsync(token);
      client.data.user = user;
      return !!user;
    } catch (error) {
      client.emit('invalid-token');
      return false;
    }
  }
}
