import { Injectable } from '@angular/core';
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

    const cachedObservable: Observable<HttpEvent<any>> | undefined = this._queueService.get(request);
    if (cachedObservable) {
      return cachedObservable;
    }

    const cachedResponse: HttpResponse<any> | undefined = this._cacheService.get(request);
    if (cachedResponse) {
      return scheduled(of(cachedResponse.clone()), asapScheduler);
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
