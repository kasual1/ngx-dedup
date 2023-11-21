import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { StarWarsService } from '../starwars.service';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent {

  people$: Observable<any> | undefined;

  constructor(private starWarsService: StarWarsService) {
    this.people$ = this.starWarsService.getPeople$(1);
  }
}
