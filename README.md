<h1 align="center">ngx-dedup</h1>

<p align="center">
Route based request deduplication for your Angular application
</p>

<p align="center"><a href="https://www.npmjs.com/package/ngx-dedup"><img src="https://img.shields.io/npm/v/ngx-dedup?color=2c7dd1&amp;label=" alt="NPM version"></a></p>


## Introduction
Many components in an Angular app need to use the same data.
With `ngx-dedup` you do not have to fetch data globally, nor forward it via input properties. Instead you can fetch data within your components without worrying about the performance implications of making multiple requests for the same data.
`ngx-dedup` intercepts all requests and automatically deduplicates requests based on the URL and options.

<p align="center">
<img height="350" src="https://github.com/kasual1/ngx-star-port/blob/main/ngx-dedup-infographic.png" alt="Ngx Starport">
</p>

## How is this different from a cahing library?
With the default configurations `ngx-dedup` only caches requests based on the current active route path. This way your data stays up to date during navigation but different components never cause a duplicated request.

## Install

```
npm i ngx-dedup
```
### 

## Usage

To use ngx-dedup, add the `NgxDedupModule` to your imports in your app.module.ts. and include the `DedupInterceptor` in the providers array.
```typescript
import { NgxDedupModule } from "ngx-dedup";

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
   providers: [{
    // 2.) Add the DedupInterceptor to your providers array
    provide: HTTP_INTERCEPTORS,
    useClass: DedupInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```
With this minimal setup all GET request are deduplicated.

## Configuration
You can pass a configuration object via `forRoot()`. Please see the list below for all config options.
```typescript
 NgxDedupModule.forRoot({
      maxAge: 5000,
      maxCacheCount: 100,
      isCachable: (request) => {
        return request.method === "GET";
      },
 }),
```

## Skip cache for certain requests
If you want to skip the cache (e.g. to force a refresh of your data), you can set the `SKIP_CACHE` token of the `HttpContext` to true
```typescript
  getPeople$(id: number, skipCache: boolean = false): Observable<any> {
        return this.http.get(`https://swapi.dev/api/people/${id}`, {
          context: new HttpContext().set(SKIP_CACHE, skipCache)
        });
    }
```
