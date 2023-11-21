import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CacheService {

    private readonly cache = new Map<string, Readonly<HttpResponse<any>>>();

    constructor() { }

    get<K, T>(req: HttpRequest<K>): Readonly<HttpResponse<T>> | undefined {
        const key: string = req.method + '@' + req.urlWithParams;
        const cached: HttpResponse<T> | undefined = this.cache.get(key);

        if (!cached) {
            return undefined;
        }

        return Object.freeze(cached);
    }

    add<K, T>(req: HttpRequest<K>, res: HttpResponse<T>): void {
        const key: string = req.method + '@' + req.urlWithParams;
        this.cache.set(key, res);
    }

    delete<K>(req: HttpRequest<K>): boolean {
        const key: string = req.method + '@' + req.urlWithParams;
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

}