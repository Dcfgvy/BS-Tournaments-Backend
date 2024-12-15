import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { createHmac, createHash } from 'crypto';
import { appConfig } from 'src/utils/appConfigs';
import { Request } from 'express';

@Injectable()
export class CheckSignatureGuard implements CanActivate {
  private signatureHeaderName: string;

  constructor(signatureHeaderName: string){
    if(!signatureHeaderName) throw new Error('Missing signature header');
    this.signatureHeaderName = signatureHeaderName;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const signatureHeader = request.headers[this.signatureHeaderName];
    const body = request.body;

    const secretKey = createHash('sha256').update(appConfig.CRYPTO_BOT_TOKEN).digest();
    const hmac = createHmac('sha256', secretKey);
    hmac.update(JSON.stringify(body));
    const calculatedSignature = hmac.digest('hex');

    return signatureHeader === calculatedSignature;
  }
}