import { Component } from '@angular/core';
import {MapComponent} from "./components/map/map.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MapComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'leaflet-test';
}
