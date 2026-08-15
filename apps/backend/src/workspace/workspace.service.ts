import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { name: string; slug: string; description?: string }) {
    return this.prisma.workspace.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        ownerId: userId,
        members: {
          create: {
            userId: userId,
            role: 'owner',
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        owner: true,
        members: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: { members: true, owner: true },
    });
    if (!workspace) throw new ForbiddenException('Workspace not found');
    const isMember = workspace.members.some(m => m.userId === userId);
    if (!isMember) throw new ForbiddenException('Access denied');
    return workspace;
  }

  async update(id: string, userId: string, data: { name?: string; slug?: string; description?: string }) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: { members: true },
    });
    if (!workspace) throw new ForbiddenException('Workspace not found');
    const isOwner = workspace.members.some(m => m.userId === userId && m.role === 'owner');
    if (!isOwner) throw new ForbiddenException('Only owner can update workspace');
    return this.prisma.workspace.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: { members: true },
    });
    if (!workspace) throw new ForbiddenException('Workspace not found');
    const isOwner = workspace.members.some(m => m.userId === userId && m.role === 'owner');
    if (!isOwner) throw new ForbiddenException('Only owner can delete workspace');
    return this.prisma.workspace.delete({ where: { id } });
  }
}