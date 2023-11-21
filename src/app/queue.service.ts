import { HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QueueService {

    private readonly queue = new Map<string, Observable<HttpEvent<any>>>();

    constructor() { }

    get<K, T>(req: HttpRequest<K>): Observable<HttpEvent<T>> | undefined {
        const key: string = req.method + '@' + req.urlWithParams;
        const queued: Observable<HttpEvent<T>> | undefined = this.queue.get(key);

        if (!queued) {
            return undefined;
        }

        return queued;
    }

    add<K, T>(req: HttpRequest<K>, obs: Observable<HttpEvent<T>>): void {
        const key: string = req.method + '@' + req.urlWithParams;
        this.queue.set(key, obs);
    }

    delete<K>(req: HttpRequest<K>): boolean {
        const key: string = req.method + '@' + req.urlWithParams;
        return this.queue.delete(key);
    }

    clear(): void {
        this.queue.clear();
    }

}