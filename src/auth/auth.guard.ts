import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const token = this.extractTokenFromRequest(req);

    const payload = await this.jwtService.verifyAsync(token, {
      secret: 'JWT_SECRET',
    });

    console.log(payload);
    return true;
  }

  private extractTokenFromRequest(request: Request) {
    if (!request.headers.authorization)
      throw new UnauthorizedException('Missing token');
    const [_, token] = request.headers.authorization.split(' ');

    if (!token) throw new UnauthorizedException('Missing token');
    return token;
  }
}
