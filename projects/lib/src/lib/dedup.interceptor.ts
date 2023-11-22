import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpContextToken
} from '@angular/common/http';
import { Observable, asapScheduler, finalize, of, scheduled, shareReplay, tap } from 'rxjs';
import { QueueService } from './queue.service';
import { CacheService } from './cache.service';
import { Router } from '@angular/router';
import { ICacheItem } from './cache-item.model';
import { IQueueItem } from './queue-item.model';

export const dedupConfig = {
  maxAge: 5000,
  maxCacheCount: 10,
  isCachable: (request: HttpRequest<any>) => {
    return request.method === 'GET';
  }
};

export const SKIP_CACHE = new HttpContextToken<boolean>(() => false);

@Injectable()
export class DedupInterceptor implements HttpInterceptor {

  private _currentUrl: string = '';

  constructor(
    private _queueService: QueueService,
    private _cacheService: CacheService,
    private _router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(this._router.url != this._currentUrl) {
      this._queueService.clear();
      this._cacheService.clear();
      this._currentUrl = this._router.url;
    }

    if(!dedupConfig.isCachable(request) || request.context.get(SKIP_CACHE)) {
      return next.handle(request);
    }

    const queudItem: IQueueItem<any> | undefined = this._queueService.get(request);
    if (queudItem && !queudItem.isExpired(dedupConfig.maxAge)) {
      return queudItem.getHttpEvent$();
    }

    const cachedItem: ICacheItem<any> | undefined = this._cacheService.get(request);
    if (cachedItem && !cachedItem.isExpired(dedupConfig.maxAge)) {
      return scheduled(of(cachedItem.getResponse()), asapScheduler);
    }

    const shared = next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this._cacheService.add(request, event.clone());
        }
      }),
      finalize(() => {
        this._queueService.delete(request);
      }),
      shareReplay()
    );

    this._queueService.add(request, shared);

    return shared;
  }
}