import { Component, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleComponent } from '../people/people.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PeopleComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChildren(PeopleComponent)
  peopleComponents!: QueryList<PeopleComponent>;

  onReloadAll(): void {
    this.peopleComponents.forEach(c => c.load());
  }
}
