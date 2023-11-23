import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DedupInterceptor, NgxDedupModule } from 'lib';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgxDedupModule.forRoot({
      maxAge: 10000,
      maxCacheCount: 100,
      isCachable: (request) => {
        return request.method === 'GET';
      }
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: DedupInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
