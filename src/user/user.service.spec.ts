import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const users = [];

const prismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    users.push({
      id: 1,
      name: 'test user',
      email: 'test@mail.com',
      password: await hash('password', 8),
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('Should be able to create a user', async () => {
    prismaMock.user.findUnique = jest.fn().mockResolvedValue(null);
    prismaMock.user.create = jest.fn().mockResolvedValue(users[0]);
    const user = await userService.createUser({
      email: 'test@mail.com',
      name: 'test user',
      password: 'password',
    });

    expect(user).toHaveProperty('id');
  });

  it('Should be able to update user data', async () => {
    const updatedData = {
      email: 'new@mail.com',
      name: 'changed name',
      password: await hash('new_password', 8),
    };

    prismaMock.user.findUnique = jest.fn().mockResolvedValue(users[0]);
    prismaMock.user.update = jest.fn().mockResolvedValue(updatedData);
    const user = await userService.updateData({ id: 1, ...updatedData });

    expect(user.email).toBe('new@mail.com');
    expect(user.name).toBe('changed name');
    expect(user.password).toBe(updatedData.password);
  });

  it('Should be able to delete a user', async () => {
    prismaMock.user.findUnique = jest.fn().mockResolvedValue(users[0]);
    prismaMock.user.delete = jest.fn().mockResolvedValue(users[0]);
    const user = await userService.delete(1);
    expect(user).toHaveProperty('id');
  });

  it('Should not be able to create a user with an existing email', async () => {
    prismaMock.user.findUnique = jest.fn().mockResolvedValue(users[0]);
    expect(
      async () =>
        await userService.createUser({
          email: 'existing@mail.com',
          name: 'Existing user',
          password: 'hashed-password',
        }),
    ).rejects.toThrow(BadRequestException);
  });

  it('Should not be able to update information of a non-existent user', () => {
    prismaMock.user.findUnique = jest.fn().mockResolvedValue(null);
    expect(async () =>
      userService.updateData({
        id: -1,
        email: 'nonexistent@mail',
        name: 'Nonexistent User',
        password: 'hashed-password',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('Should not be able to delete a non-existent user', async () => {
    prismaMock.user.findUnique = jest.fn().mockResolvedValue(null);
    prismaMock.user.delete = jest.fn().mockResolvedValue(users[0]);

    expect(() => userService.delete(1)).rejects.toThrow(NotFoundException);
  });
});
