import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheItem, ICacheItem } from './cache-item.model';

@Injectable({ providedIn: 'root' })
export class CacheService {

    private readonly cache = new Map<string, Readonly<ICacheItem<any>>>();

    constructor() { }

    private buildKey<K>(req: HttpRequest<K>): string {
        return req.urlWithParams;
    }

    get<K, T>(req: HttpRequest<K>): Readonly<ICacheItem<T>> | undefined {
        const key: string = this.buildKey(req);
        const cached: ICacheItem<T> | undefined = this.cache.get(key);

        if (!cached) {
            return undefined;
        }

        return Object.freeze(cached);
    }

    add<K, T>(req: HttpRequest<K>, res: HttpResponse<T>): void {
        const key: string = this.buildKey(req);
        const cacheItem = new CacheItem<T>(res, new Date());
        this.cache.set(key, cacheItem);
    }

    delete<K>(key: string): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

}
