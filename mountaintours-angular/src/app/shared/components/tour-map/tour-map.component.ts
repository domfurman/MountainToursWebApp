import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import { GeoJSON } from 'geojson';
import axios from 'axios';
import 'leaflet-layerindex';
import { LatLngBoundsLiteral } from 'leaflet';
import AutoComplete from '@tarekraafat/autocomplete.js/dist/autoComplete.js';
import {MapDetails} from "../../models/map-details";
import {MapService} from "../../services/map.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";
@Component({
  selector: 'app-tour-map',
  standalone: true,
  imports: [],
  templateUrl: './tour-map.component.html',
  styleUrl: './tour-map.component.scss'
})
export class TourMapComponent implements OnInit{
  @Input() mapDetails!: MapDetails;
  // @Input() mapId!: string;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  API_KEY = "RzwAWVCO0lNed8aeU4gR_nN5zFcmzmuG2EtCvQdCmZM";
  map!: L.Map;
  routeLayer: any;
  waypoints: [number, number][] = [];
  startMarker: L.Marker | null = null;
  endMarker: L.Marker | null = null;
  waypointsMarkers: L.Marker[]= [];



  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.cdr.detectChanges()
    this.configMap();
    this.route();

  }


  configMap() {
    this.map = L.map(this.mapContainer.nativeElement).setView([50.049683, 19.944544], 16);

    const tileLayers = {
      'Basic': L.tileLayer(`https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${this.API_KEY}`, {
        minZoom: 0,
        maxZoom: 19,
        attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
      }),
      'Outdoor': L.tileLayer(`https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=${this.API_KEY}`, {
        minZoom: 0,
        maxZoom: 19,
        attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
      }),
      'Winter': L.tileLayer(`https://api.mapy.cz/v1/maptiles/winter/256/{z}/{x}/{y}?apikey=${this.API_KEY}`, {
        minZoom: 0,
        maxZoom: 19,
        attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
      }),
      'Aerial': L.tileLayer(`https://api.mapy.cz/v1/maptiles/aerial/256/{z}/{x}/{y}?apikey=${this.API_KEY}`, {
        minZoom: 0,
        maxZoom: 19,
        attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
      }),
    };

    tileLayers['Outdoor'].addTo(this.map);

    L.control.layers(tileLayers).addTo(this.map);

    const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: []
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
  }

  setMarkerIcon() {
    const locationIcon = L.icon({
      iconUrl: 'assets/markers/location-pin.png',
      iconRetinaUrl: 'assets/markers/location-pin.png',
      // shadowUrl: 'assets/markers/location-pin.png',
      iconSize: [25, 30],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })

    L.Marker.prototype.options.icon = locationIcon;

    return locationIcon;
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
      [minLatitude, minLongitude],
      [maxLatitude, maxLongitude],
      // [minLongitude, minLatitude],
      // [maxLongitude, maxLatitude],
    ];
  }
  async route() {
    const start = L.latLng(this.mapDetails.startPlace[0], this.mapDetails.startPlace[1]);
    const end = L.latLng(this.mapDetails.endPlace[0], this.mapDetails.endPlace[1]);
    const waypoints = this.mapDetails.waypoints;

    this.startMarker = L.marker([this.mapDetails.startPlace[0], this.mapDetails.startPlace[1]], { icon: this.setMarkerIcon() })
      .addTo(this.map)
      .bindPopup("Start")

    this.endMarker = L.marker([this.mapDetails.endPlace[0], this.mapDetails.endPlace[1]], { icon: this.setMarkerIcon() })
      .addTo(this.map)
      .bindPopup("End")

    const waypointMarkers = this.mapDetails.waypoints;
    waypointMarkers.forEach((waypoint) => {
      let marker = L.marker([waypoint[1], waypoint[0]], {icon: this.setMarkerIcon()})
        .addTo(this.map)
        .bindPopup("Waypoint")
      this.waypointsMarkers.push(marker);
      console.log(waypoint);
    })



    try {
      const url = new URL(`https://api.mapy.cz/v1/routing/route`);

      const params = new URLSearchParams({
        'apikey': this.API_KEY,
        'lang': 'pl',
        'start': `${start.lng},${start.lat}`,
        'end': `${end.lng},${end.lat}`,
        'routeType': 'foot_fast',
        'avoidToll': 'false'
      });

      if (waypoints.length > 0) {
        params.set('waypoints', waypoints.map(point => point.join(',')).join(';'));
      }

      const response = await axios.get(url.toString(), {params});
      const json = response.data
      console.log(`length: ${json.length / 1000} km`, `duration: ${Math.floor(json.duration / 60)}m ${json.duration % 60}s`);

      if (this.routeLayer) {
        this.map.removeLayer(this.routeLayer);
      }
      this.routeLayer = L.geoJSON(json.geometry, {}).addTo(this.map);

      const bboxCoords = this.bbox(json.geometry.geometry.coordinates);
      this.map.fitBounds(bboxCoords, {padding: [40, 40]});
    } catch (ex) {
      console.log(ex)
    }
  }

}
