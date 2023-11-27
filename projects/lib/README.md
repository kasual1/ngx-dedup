<h1 align="center">ngx-dedup</h1>

<p align="center">
Route based request deduplication for your Angular application
</p>

<p align="center"><a href="https://www.npmjs.com/package/ngx-dedup"><img src="https://img.shields.io/npm/v/ngx-dedup?color=2c7dd1&amp;label=" alt="NPM version"></a></p>

<p align="center">Read a more detailed article <a href="https://medium.com/stackademic/request-deduplication-in-angular-4e7c5ef259ce">here</a></p>

## Introduction
Many components in an Angular app need to use the same data.
With `ngx-dedup` you do not have to fetch data globally, nor forward it via input properties. Instead you can fetch data within your components without worrying about the performance implications of making multiple requests for the same data.
`ngx-dedup` intercepts all requests and automatically deduplicates requests based on the URL and options.

<p align="center">
<img height="350" src="https://github.com/kasual1/ngx-star-port/blob/main/ngx-dedup-infographic.png" alt="Ngx Starport">
</p>

## How is this different from a caching library?
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
  imports: [NgxDedupModule.forRoot()], //Add to your imports
  bootstrap: [AppComponent],
})
export class AppModule {}
```
With this minimal setup all GET request are deduplicated.

## Configuration
You can pass a configuration object via `forRoot()`. Please see the list below for all config options.
```typescript
 NgxDedupModule.forRoot({
      isRouteBased: true,
      isLoggingEnabled: false,
      maxAge: 10000,
      maxChacheSize: 100,
      isCachable: (request: HttpRequest<any>) => request.method === 'GET'
 }),
```
| Property |  Default Value  |  Description   |
| :--------:   | :-------------: | :------------: |
| isRouteBased |       true      |  If set to `true` requests are only deduplicated on the current active route path   |
| isLoggingEnabled |       false      |  If set to `true` all interactions within NgxDebug are logged to the console  |
| maxAge |       undefined      |  Sets the maximum caching age in milliseconds. By default requests have no maxAge.   |
| maxCacheSize |      100      |  Limits the number of cachable items   |
| isCachable | `request.method === 'GET'` |  By default all GET requests are cachable. Use custom logic to overwrite this behavior   |

## Skip the cache for certain requests
If you want certain requests to skip the cache (e.g. to force a refresh of your data), you can set the `NGX_DEDUP_SKIP_CACHE` token of the `HttpContext` to true
```typescript

const context = new HttpContext().set(NGX_DEDUP_SKIP_CACHE, true);
this.http.get('https://swapi.dev/api/people/1', { context });

```

## Remove certain requests from cache
To remove specific requests from cache, inject the `NgxDedupService` in your constructor and call the `removeFromCache()` method. Pass the requests URL + queryParams as the key.
```typescript

constructor(private _ngxDedupService: NgxDedupService) { }

someMethod(): void {
  this._ngxDedupService.removeFromCache('https://swapi.dev/api/people/1');
}

```

## Remove all requests from cache
To remove all requests from cache, inject the `NgxDedupService` in your constructor and call the `clearCache()` method.
```typescript

constructor(private _ngxDedupService: NgxDedupService) { }

someMethod(): void {
  this._ngxDedupService.clearCache();
}

```

