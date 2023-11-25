import { HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IQueueItem, QueueItem } from './queue-item.model';

@Injectable({ providedIn: 'root' })
export class QueueService {

    private readonly queue = new Map<string, Readonly<IQueueItem<any>>>();

    private buildKey<K>(req: HttpRequest<K>): string {
        return req.urlWithParams;
    }

    get<K, T>(req: HttpRequest<K>): IQueueItem<T> | undefined {
        const key: string = this.buildKey(req);
        const queued: IQueueItem<any> | undefined = this.queue.get(key);

        if (!queued) {
            return undefined;
        }

        return queued;
    }

    add<K, T>(req: HttpRequest<K>, obs: Observable<HttpEvent<T>>): void {
        const key: string = this.buildKey(req);
        const queueItem = new QueueItem<T>(obs, new Date());
        this.queue.set(key, queueItem);
    }

    delete<K>(key: string): boolean {
        return this.queue.delete(key);
    }

    clear(): void {
        this.queue.clear();
    }

}
