import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SseService } from '../sse/sse.service';

@Injectable()
export class QueueService {
  constructor(private prisma: PrismaService, private sseService: SseService) {}

  async getQueue() {
    return this.prisma.queuePosition.findMany({
      orderBy: { position: 'asc' },
      include: {
        driver: {
          include: {
            assignments: {
              where: { status: 'atribuido' },
              include: { customer: true },
            },
          },
        },
      },
    });
  }

  async popFront() {
    const frontDriverEntry = await this.prisma.queuePosition.findUnique({
      where: { position: 1 },
    });

    if (!frontDriverEntry) {
      throw new Error('A fila está vazia.');
    }

    await this.prisma.$transaction(async (tx) => {
      // 1. Remove o primeiro da fila
      await tx.queuePosition.delete({ where: { position: 1 } });

      // 2. "Compacta" a fila, atualizando as posições
      await tx.queuePosition.updateMany({
        where: { position: { gt: 1 } },
        data: { position: { decrement: 1 } },
      });
    });
    
    this.sseService.sendEvent({ type: 'QUEUE_UPDATED' });
    return frontDriverEntry;
  }
  
  // Adicione aqui a lógica para sendToEnd, reorder, etc.
}