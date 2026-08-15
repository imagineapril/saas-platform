import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WorkspaceService } from './workspace.service';

@Controller('workspaces')
@UseGuards(AuthGuard('jwt'))
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Post()
  create(@Req() req, @Body() body: { name: string; slug: string; description?: string }) {
    const userId = req.user.userId;
    return this.workspaceService.create(userId, body);
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user.userId;
    return this.workspaceService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    return this.workspaceService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req, @Body() body: { name?: string; slug?: string; description?: string }) {
    const userId = req.user.userId;
    return this.workspaceService.update(id, userId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    return this.workspaceService.remove(id, userId);
  }
}