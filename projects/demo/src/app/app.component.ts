import { Component } from '@angular/core';
import { NgxDedupService } from 'lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo';

  constructor(private _ngxDedupService: NgxDedupService) { }

  onClearCache(): void {
    this._ngxDedupService.clearCache();
  }
}
