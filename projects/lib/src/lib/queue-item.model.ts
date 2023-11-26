import { HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";

export interface IQueueItem<T> {
  getHttpEvent$(): Observable<HttpEvent<T>>;
  getAdded(): Date;
  setHttpEvent(response: Observable<HttpEvent<T>>): void;
  setAdded(added: Date): void;
  isExpired(maxAge: number | undefined): boolean;
}

export class QueueItem<T> implements IQueueItem<T> {
  constructor(
    private _event$: Observable<HttpEvent<T>>,
    private _added: Date
  ) {}

  public getHttpEvent$(): Observable<HttpEvent<T>> {
    return this._event$;
  }

  public getAdded(): Date {
    return this._added;
  }

  public setHttpEvent(event$: Observable<HttpEvent<T>>): void {
    this._event$ = event$;
  }

  public setAdded(added: Date): void {
    this._added = added;
  }

  public isExpired(maxAge: number | undefined): boolean {
    if(!maxAge) {
      return false;
    }
    return (Date.now() - this._added.getTime()) > maxAge;
  }
}
