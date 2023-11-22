import { NgModule } from '@angular/core';
import { DedupInterceptor } from './dedup.interceptor';

@NgModule({
  providers: [
    DedupInterceptor
  ]
})
export class NgxDedupModule { }
