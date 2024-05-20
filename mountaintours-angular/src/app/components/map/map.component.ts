import { Component, Input } from '@angular/core';
import * as L from 'leaflet';
import { GeoJSON } from 'geojson';
import axios from 'axios';
import 'leaflet-layerindex';
import { LatLngBoundsLiteral } from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {

  @Input() public name = '';

  API_KEY = "RzwAWVCO0lNed8aeU4gR_nN5zFcmzmuG2EtCvQdCmZM";
  map!: L.Map;
  routeLayer: any;

  ngOnInit(): void {
    this.configMap()
  }

  configMap() {
    this.map = L.map('map').setView([50.0723658, 14.418540], 16 );

    L.tileLayer(`https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${this.API_KEY}`, {
      minZoom: 0,
      maxZoom: 19,
      attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
    }).addTo(this.map);



    // GeoJSON.Feature<GeoJSON.LineString>

    const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: []
          // [14.418540, 50.0723658], //Prague
          // [16.606836, 49.195061] //Brno
      },
      properties: {}
    };

    const routeLayer = L.geoJSON(routeGeoJSON, {
      style: (feature) => {
        return {
          color: '#0033ff',
          weight: 8,
          opacity: 0.6
        };
      }
    }).addTo(this.map)

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

    this.route();
  }

  bbox(coords: [number, number][]): LatLngBoundsLiteral {
    let minLatitude = Infinity;
    let minLongitude = Infinity;
    let maxLatitude = -Infinity;
    let maxLongitude = -Infinity;

    coords.forEach(coor => {
      minLongitude = Math.min(coor[0], minLongitude);
      maxLongitude = Math.max(coor[0], maxLongitude);
      minLatitude = Math.min(coor[1], minLatitude);
      maxLatitude = Math.max(coor[1], maxLatitude);
    });

    return [
      [minLongitude, minLatitude],
      [maxLongitude, maxLatitude],
    ];
  }
  async route() {
    const coordsPrague = L.latLng(50.0723658, 14.418540);
    const coordsBrno = L.latLng(49.195061, 16.606836);
    try {
      const url = new URL(`https://api.mapy.cz/v1/routing/route`);

      // url.searchParams.set('lang', 'en');
      // url.searchParams.set('apikey', this.API_KEY);
      // url.searchParams.set('start', `${coordsPrague.lng},${coordsPrague.lat}`);
      // url.searchParams.set('end', `${coordsBrno.lng},${coordsBrno.lat}`);
      // url.searchParams.set('routeType', 'car_fast');
      // url.searchParams.set('format', 'geojson');
      // url.searchParams.set('avoidToll', 'false');

      // const response = await fetch(url.toString(), {
      //   mode: 'cors',
      // });
      // const json = await response.json();
      //
      // console.log(json)

      // console.log(
      //   `length: ${json.length / 1000} km`,
      //   `duration: ${Math.floor(json.duration / 60)}m ${json.duration % 60}s`
      //   )

      const params = new URLSearchParams({
        'apikey': this.API_KEY,
        'lang': 'cs',
        'start': `${coordsPrague.lng},${coordsPrague.lat}`,
        'end': `${coordsBrno.lng},${coordsBrno.lat}`,
        'routeType': 'car_fast_traffic',
        'avoidToll': 'false'
      });

      const response = await axios.get(url.toString(), {params});
      const json = response.data
      // const json: GeoJSON.Feature<GeoJSON.LineString> = response.data;
      // const json: GeoJSON.Feature<GeoJSON.LineString> = response.data;
      // console.log(json.geometry.geometry.coordinates);
      console.log(this.name)
      console.log(`length: ${json.length / 1000} km`, `duration: ${Math.floor(json.duration / 60)}m ${json.duration % 60}s`);

      if (this.routeLayer) {
        this.map.removeLayer(this.routeLayer);
      }
      //
      this.routeLayer = L.geoJSON(json.geometry, {
        // style: {
        //   color: '#0033ff',
        //   weight: 8,
        //   opacity: 0.6
        // }
      }).addTo(this.map);
      //
      const bboxCoords = this.bbox(json.geometry.geometry.coordinates);
      this.map.fitBounds(bboxCoords, { padding: [40, 40] });
    } catch (ex) {
      console.log(ex)
    }
  }




}
