import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { PrismaService } from '../prisma.service';

interface SignInDTO {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn({ email, password }: SignInDTO) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch)
      throw new UnauthorizedException('Invalid email or password');

    const token = await this.jwtService.signAsync(
      { sub: user.id },
      { secret: 'JWT_SECRET' },
    );

    return {
      user: user,
      token,
    };
  }
}
