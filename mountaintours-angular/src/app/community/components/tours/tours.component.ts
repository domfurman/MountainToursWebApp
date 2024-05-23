import { Component, OnInit } from '@angular/core';
import {Map} from "../../../models/map";
import {MapService} from "../../../services/map.service";

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss'
})
export class ToursComponent implements OnInit{
  mapList: Map[] = [];

  constructor(private mapService: MapService) {
  }

  ngOnInit(): void {
    this.loadMaps();
    }

  loadMaps() {
    this.mapService.getAllMaps().subscribe(
      (data) => this.mapList = data
    )
  }
}
