<h1 align="center">ngx-dedup</h1>

<p align="center">
    Route based http cache for Angular
</p>

<p align="center"><a href="https://www.npmjs.com/package/ngx-dedup"><img src="https://img.shields.io/npm/v/ngx-dedup?color=2c7dd1&amp;label=" alt="NPM version"></a></p>

<br>
<br>

## Introduction

Route based http cache for Angular

## Install

```
npm i ngx-dedup
```

###

## Usage

To use ngx-dedup, add the `NgxDedupModule` to your imports in your app.module.ts. and include the `DedupInterceptor` in the providers array. You can pass a configuration object via `forRoot()`.

```typescript
import { NgxStarPortModule } from "ngx-star-port";

@NgModule({
  declarations: [],
  imports: [
    // 1.) Add NgxDedupModule + configuration to your imports
    NgxDedupModule.forRoot({
      maxAge: 5000,
      maxCacheCount: 100,
      isCachable: (request) => {
        return request.method === "GET";
      },
    }),
  ],
  providers: [
    {
      // 2.) Add the DedupInterceptor to your providers array
      provide: HTTP_INTERCEPTORS,
      useClass: DedupInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```
