import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {

  API_KEY = "RzwAWVCO0lNed8aeU4gR_nN5zFcmzmuG2EtCvQdCmZM";

  ngOnInit(): void {
    this.configMap()
  }

  map: any;

  configMap() {
    //

    this.map = L.map('map').setView([49.8729317, 14.8981184], 16 );

    L.tileLayer(`https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${this.API_KEY}`, {
      minZoom: 0,
      maxZoom: 19,
      attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
    }).addTo(this.map);

    const LogoControl = L.Control.extend({
      options: {
        position: 'bottomleft',
      },

      onAdd: function (map: L.Map) {
        const container = L.DomUtil.create('div');
        const link = L.DomUtil.create('a', '', container);

        link.setAttribute('href', 'http://mapy.cz/');
        link.setAttribute('target', 'blank');
        link.innerHTML = '<img src="https://api.mapy.cz/img/api/logo.svg" alt=""/>';
        L.DomEvent.disableClickPropagation(link);

        return container;
      },
    });

    new LogoControl().addTo(this.map)
    // this.map = L.map('map', {zoom: 10}).locate({
    //   setView: true,
    //   maxZoom: 16,
    // });
    //
    // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution:
    //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    // }).addTo(this.map);
  }

}
