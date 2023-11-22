import { HttpResponse } from "@angular/common/http";

export interface ICacheItem<T> {
  getResponse(): HttpResponse<T>;
  getAdded(): Date;
  setResponse(response: HttpResponse<T>): void;
  setAdded(added: Date): void;
  isExpired(maxAge: number): boolean;
}

export class CacheItem<T> implements ICacheItem<T> {
  constructor(
    private _response: HttpResponse<T>,
    private _added: Date
  ) {}

  public getResponse(): HttpResponse<T> {
    return this._response.clone();
  }

  public getAdded(): Date {
    return this._added;
  }

  public setResponse(response: HttpResponse<T>): void {
    this._response = response;
  }

  public setAdded(added: Date): void {
    this._added = added;
  }

  public isExpired(maxAge: number): boolean {
    return (Date.now() - this._added.getTime()) > maxAge;
  }
}
