import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { QueueService } from './queue.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { RolesGuard } from '../guards/roles.guard';

@Controller('queue')
@UseGuards(AuthenticatedGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get()
  getQueue() {
    return this.queueService.getQueue();
  }

  @Post('pop-front')
  @Roles('admin')
  popFront() {
    return this.queueService.popFront();
  }
}