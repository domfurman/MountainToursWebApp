import { Component, Input, OnInit } from '@angular/core';
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
export class MapComponent implements OnInit{

  @Input() public name = '';

  API_KEY = "RzwAWVCO0lNed8aeU4gR_nN5zFcmzmuG2EtCvQdCmZM";
  map!: L.Map;
  routeLayer: any;
  markersLayer: L.GeoJSON<GeoJSON.FeatureCollection<GeoJSON.Geometry>> | undefined;

  ngOnInit(): void {
    this.configMap();
    this.setupFormListener();
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

      const params = new URLSearchParams({
        'apikey': this.API_KEY,
        'lang': 'en',
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

  async geocode(query: string) {
    try {
      const url = new URL(`https://api.mapy.cz/v1/geocode`);

      const params = new URLSearchParams({
        'lang': 'en',
        'apikey': this.API_KEY,
        'query': query,
        'limit': '15'
      });
      [
        'regional.municipality',
        'regional.municipality_part',
        'regional.street',
        'regional.address'
      ].forEach(type => url.searchParams.append('type', type));

      const response = await axios.get(url.toString(), {params});
      const json = response.data;
      console.log('geocode', json);

      if (this.markersLayer) {
        this.map.removeLayer(this.markersLayer);
      }

      const featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
        type: 'FeatureCollection',
        features: json.items.map((item: any) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [item.position.lon, item.position.lat],
          },
          properties: {
            name: item.name,
            label: item.label,
            location: item.location,
            longitude: item.position.lon,
            latitude: item.position.lat,
          },
        })),
      };

      this.markersLayer = L.geoJSON(featureCollection).addTo(this.map);

      const bboxCoords = this.bbox(json.items.map((item: any) => ([item.position.lon, item.position.lat])));
      this.map.fitBounds(bboxCoords, { padding: [40, 40] });

    } catch (ex) {
      console.log(ex)
    }
  }

  setupFormListener() {
    const form = document.querySelector('#geocode-form');
    const input = document.querySelector('#geocode-input') as HTMLInputElement;

    if (form && input) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.geocode(input.value);
      }, false);
    }
  }

}
