import { Component } from '@angular/core';
import { ScatterComponent } from './scatter/scatter.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ ScatterComponent ]
})
export class AppComponent {
  title = 'app works!';
}
