import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleComponent } from '../people/people.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PeopleComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

}
