import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

const prismaMock = {
  user: {
    findUnique: jest.fn(),
  },
};

const userMock = [];

async function createAuthenticatedUser() {
  return {
    email: 'test@mail.com',
    password: await hash('password', 8),
  };
}
describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeAll(async () => {
    userMock.push(createAuthenticatedUser());
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return a jwt-token if credentials are valid', async () => {});

  it('should not allow access the token if credentials are invalid', async () => {
    const mockToken = 'mocked-token';
    const authInput = {
      email: 'test@mai.com',
      password: 'passwrd',
    };
    (jwtService.signAsync as jest.Mock).mockResolvedValue(mockToken);
    prismaMock.user.findUnique = jest.fn().mockResolvedValue(userMock[0]);

    expect(authService.signIn(authInput)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
