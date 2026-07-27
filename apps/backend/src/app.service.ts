import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async testDb() {
    const user = await this.prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashed_password',
        name: 'Test User',
      },
    });
    return user;
  }
}
