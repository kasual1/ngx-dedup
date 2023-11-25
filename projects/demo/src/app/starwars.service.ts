import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGX_DEDUP_SKIP_CACHE } from 'lib';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class StarWarsService {

    constructor(private http: HttpClient) { }

    getPeople$(id: number, skipCache: boolean = false): Observable<any> {
        return this.http.get(`https://swapi.dev/api/people/${id}`, {
          context: new HttpContext().set(NGX_DEDUP_SKIP_CACHE, skipCache)
        });
    }



}
