import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { NgxDedupInterceptor } from './dedup.interceptor';
import { HTTP_INTERCEPTORS, HttpContextToken, HttpRequest } from '@angular/common/http';

export type NgxDedupConfig = {
  isRouteBased?: boolean,
  isLoggingEnabled?: boolean,
  maxAge: number | undefined,
  maxChacheSize: number | undefined,
  isCachable: (request: HttpRequest<any>) => boolean | undefined
};

export const NGX_DEDUP_CONFIG = new InjectionToken<NgxDedupConfig>('NGX_DEDUP_CONFIG');

export const NGX_DEDUP_SKIP_CACHE = new HttpContextToken<boolean>(() => false);

@NgModule({
})
export class NgxDedupModule {

  static forRoot(config: Partial<NgxDedupConfig> = {}): ModuleWithProviders<NgxDedupModule> {

    const defaultConfig: NgxDedupConfig = {
      isRouteBased: true,
      isLoggingEnabled: false,
      maxAge: undefined,
      maxChacheSize: 100,
      isCachable: (request: HttpRequest<any>) => request.method === 'GET'
    };

    return {
      ngModule: NgxDedupModule,
      providers: [
        { provide: NGX_DEDUP_CONFIG, useValue: { ...defaultConfig, ...config } },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: NgxDedupInterceptor,
          multi: true
        }
      ]
    };
  }

 }
