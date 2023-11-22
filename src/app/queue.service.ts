import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IQueueItem, QueueItem } from './queue-item.model';

@Injectable({ providedIn: 'root' })
export class QueueService {

  private readonly queue = new Map<string, Readonly<IQueueItem<any>>>();

  constructor() { }

  get<K, T>(req: HttpRequest<K>): IQueueItem<T> | undefined {
    const key: string = req.method + '@' + req.urlWithParams;
    const queued: IQueueItem<any> | undefined = this.queue.get(key);

    if (!queued) {
        return undefined;
    }

    return queued;
}

  add<K, T>(req: HttpRequest<K>, obs: Observable<HttpEvent<T>>): void {
      const key: string = req.method + '@' + req.urlWithParams;
      const queueItem = new QueueItem<T>(obs, new Date());
      this.queue.set(key, queueItem);
  }

  delete<K>(req: HttpRequest<K>): boolean {
      const key: string = req.method + '@' + req.urlWithParams;
      return this.queue.delete(key);
  }

  clear(): void {
      this.queue.clear();
  }

}
