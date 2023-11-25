import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, asapScheduler, finalize, of, scheduled, shareReplay, tap } from 'rxjs';
import { QueueService } from './queue.service';
import { CacheService } from './cache.service';
import { Router } from '@angular/router';
import { ICacheItem } from './cache-item.model';
import { IQueueItem } from './queue-item.model';
import { NGX_DEDUP_CONFIG as NGX_DEDUP_CONFIG, NGX_DEDUP_SKIP_CACHE, NgxDedupConfig } from './ngx-dedup.module';
import { LoggingService } from './logging.service';


@Injectable()
export class NgxDedupInterceptor implements HttpInterceptor {

  private config: NgxDedupConfig;

  private _currentUrl: string = '';

  constructor(
    private _queueService: QueueService,
    private _cacheService: CacheService,
    private _loggingService: LoggingService,
    private _router: Router
  ) {
    this.config = inject(NGX_DEDUP_CONFIG);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(this.config.isRouteBased && this._router.url != this._currentUrl) {
    
      this._currentUrl = this._router.url;
      this._loggingService.log(`Route changed to: ${this._router.url}.`);

      this._cacheService.clear();
      this._loggingService.log(`Clear cache.`);

      this._queueService.clear();
      this._loggingService.log(`Clear queue.`);

    }

    if(!this.config.isCachable(request)) {

      this._loggingService.log(`Request is not cachable: ${request.method + '@' + request.urlWithParams}.`);

      return next.handle(request);
    }

    if(request.context.get(NGX_DEDUP_SKIP_CACHE)){

      this._loggingService.log(`Request skipped cache: ${request.method + '@' + request.urlWithParams}.`);

      return next.handle(request);
    }

    const queudItem: IQueueItem<any> | undefined = this._queueService.get(request);
    if (queudItem && !queudItem.isExpired(this.config.maxAge)) {

      this._loggingService.log(`Get request from queue: ${request.method + '@' + request.urlWithParams}.`);

      return queudItem.getHttpEvent$();
    }

    const cachedItem: ICacheItem<any> | undefined = this._cacheService.get(request);
    if (cachedItem && !cachedItem.isExpired(this.config.maxAge)) {

      this._loggingService.log(`Get request from cache: ${request.method + '@' + request.urlWithParams}.`);

      return scheduled(of(cachedItem.getResponse()), asapScheduler);
    }

    const shared = next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {

          this._cacheService.add(request, event.clone());

          this._loggingService.log(`Added request to cache: ${request.method + '@' + request.urlWithParams}.`);
        }
      }),
      finalize(() => {

        this._queueService.delete(request.urlWithParams);

        this._loggingService.log(`Deleted request from queue: ${request.method + '@' + request.urlWithParams}.`);
      }),
      shareReplay()
    );

    this._queueService.add(request, shared);

    this._loggingService.log(`Added request to queue: ${request.method + '@' + request.urlWithParams}.`);

    return shared;
  }
}
