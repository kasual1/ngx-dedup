import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { DedupInterceptor } from './dedup.interceptor';
import { HttpRequest } from '@angular/common/http';

export type DedupConfig = {
  maxAge: number,
  maxCacheCount: number,
  isCachable: (request: HttpRequest<any>) => boolean
};

export const DEDUP_CONFIG_TOKEN = new InjectionToken<DedupConfig>('DEDUP_CONFIG_TOKEN');
@NgModule({
})
export class NgxDedupModule {

  static forRoot(config: DedupConfig): ModuleWithProviders<NgxDedupModule> {
    return {
      ngModule: NgxDedupModule,
      providers: [
        { provide: DEDUP_CONFIG_TOKEN, useValue: config}
      ]
    }
  }

 }
