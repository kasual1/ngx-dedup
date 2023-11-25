import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';
import { QueueService } from './queue.service';

@Injectable({ providedIn: 'root' })
export class NgxDedupService {

    constructor(
        private _cacheService: CacheService,
        private _queueService: QueueService
    ) { }

    removeFromCache(key: string): void {
        this._cacheService.delete(key);
        this._queueService.delete(key);
    }

    clearCache(): void {
        this._cacheService.clear();
        this._queueService.clear();
    }

}