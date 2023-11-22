import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheItem, ICacheItem } from './cache-item.model';

@Injectable({ providedIn: 'root' })
export class CacheService {

    private readonly cache = new Map<string, Readonly<ICacheItem<any>>>();

    constructor() { }

    get<K, T>(req: HttpRequest<K>): Readonly<ICacheItem<T>> | undefined {
        const key: string = req.method + '@' + req.urlWithParams;
        const cached: ICacheItem<T> | undefined = this.cache.get(key);

        if (!cached) {
            return undefined;
        }

        return Object.freeze(cached);
    }

    add<K, T>(req: HttpRequest<K>, res: HttpResponse<T>): void {
        const key: string = req.method + '@' + req.urlWithParams;
        const cacheItem = new CacheItem<T>(res, new Date());
        this.cache.set(key, cacheItem);
    }

    delete<K>(req: HttpRequest<K>): boolean {
        const key: string = req.method + '@' + req.urlWithParams;
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

}
