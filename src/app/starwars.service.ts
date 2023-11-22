import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SKIP_CACHE } from './dedup.interceptor';

@Injectable({providedIn: 'root'})
export class StarWarsService {

    constructor(private http: HttpClient) { }

    getPeople$(id: number, skipCache: boolean = false): Observable<any> {
        return this.http.get(`https://swapi.dev/api/people/${id}`, {
          context: new HttpContext().set(SKIP_CACHE, skipCache)
        });
    }

}
