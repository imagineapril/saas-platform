import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name?: string) {
    // Проверяем, существует ли пользователь
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Генерируем JWT
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }

  async login(email: string, password: string) {
    // Ищем пользователя
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Сравниваем пароли
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Генерируем JWT
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }
}