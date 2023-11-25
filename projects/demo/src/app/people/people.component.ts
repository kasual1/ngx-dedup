import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, shareReplay } from 'rxjs';
import { StarWarsService } from '../starwars.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule, FormsModule, PeopleComponent],
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit{

  people$: Observable<any> | undefined;

  skipCache = false;

  constructor(private starWarsService: StarWarsService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.people$ = this.starWarsService.getPeople$(1, this.skipCache);
  }

  onReloadSpecific(): void {
    this.load();
  }
}
