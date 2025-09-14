import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('events')
export class SseController {
  constructor(private sseService: SseService) {}

  @Sse()
  sse(): Observable<MessageEvent> {
    return this.sseService.getEvents().pipe(
      map((data): MessageEvent => ({ data })),
    );
  }
}