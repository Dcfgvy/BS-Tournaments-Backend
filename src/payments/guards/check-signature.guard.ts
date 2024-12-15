import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { createHmac, createHash } from 'crypto';
import { appConfig } from 'src/utils/appConfigs';

@Injectable()
export class CheckSignatureGuard implements CanActivate {
  signatureHeaderName: string;

  constructor(signatureHeaderName: string){
    if(!signatureHeaderName) throw new Error('Missing signature header');
    this.signatureHeaderName = signatureHeaderName;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const signatureHeader = request.headers[this.signatureHeaderName];
    const body = request.body;

    const secretKey = createHash('sha256').update(appConfig.CRYPTO_BOT_TOKEN).digest('hex');
    const hmac = createHmac('sha256', secretKey);
    hmac.update(JSON.stringify(body));
    const calculatedSignature = hmac.digest('hex');

    return signatureHeader === calculatedSignature;
  }
}