<h3 align="center">ngx-dedup</h3>

<p align="center">
Http request deduplication for Angular
</p>

<p align="center"><a href="https://www.npmjs.com/package/ngx-dedup"><img src="https://img.shields.io/npm/v/ngx-dedup?color=2c7dd1&amp;label=" alt="NPM version"></a></p>

<br>
<br>

## Introduction

Ngx-dedup is a library to deduplicate http requests in Angular.

## Install

```
npm i ngx-dedup
```

## Usage

To use ngx-dedup, add the `NgxDedupModule` to your imports in your app.module.ts. and include the `DedupInterceptor` in the providers array. You can pass a configuration object via `forRoot()`.

```typescript
import { NgxStarPortModule } from "ngx-star-port";

@NgModule({
  declarations: [],
  imports: [
    NgxDedupModule.forRoot({
      maxAge: 5000,
      maxCacheCount: 100,
      isCachable: (request) => {
        return request.method === "GET";
      },
    }),
  ],
   providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: DedupInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```