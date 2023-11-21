import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class StarWarsService {

    constructor(private http: HttpClient) { }

    getPeople$(id: number): Observable<any> {
        return this.http.get(`https://swapi.dev/api/people/${id}`);
    }

}