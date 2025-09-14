import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private events = new Subject<any>();

  sendEvent(data: any) {
    this.events.next(data);
  }

  getEvents() {
    return this.events.asObservable();
  }
}