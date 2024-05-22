import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { GeoJSON } from 'geojson';
import axios from 'axios';
import 'leaflet-layerindex';
import { LatLngBoundsLiteral } from 'leaflet';
import AutoComplete from '@tarekraafat/autocomplete.js/dist/autoComplete.js';
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

  startPlace: any;
  endPlace: any;

  ngOnInit(): void {
    this.configMap();
    // this.setupFormListener();
    this.autocomplete('startAutoComplete', this.setStartPlace.bind(this));
    this.autocomplete('endAutoComplete', this.setEndPlace.bind(this));
  }

  console() {
    console.log(`${this.startPlace[0]}, ${this.startPlace[1]}`);
  }

  configMap() {
    this.map = L.map('map').setView([50.049683, 19.944544], 16 );

    // L.tileLayer(`https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${this.API_KEY}`, {
    //   minZoom: 0,
    //   maxZoom: 19,
    //   attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
    // }).addTo(this.map);

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
    // this.route();
    // this.setMarkerIcon();
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
    const start = L.latLng(this.startPlace[0], this.startPlace[1]);
    const end = L.latLng(this.endPlace[0], this.endPlace[1]);
    const coordsPrague = L.latLng(50.0723658, 14.418540);
    const coordsBrno = L.latLng(49.195061, 16.606836);
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

      const response = await axios.get(url.toString(), {params});
      const json = response.data
      console.log(this.name)
      console.log(`length: ${json.length / 1000} km`, `duration: ${Math.floor(json.duration / 60)}m ${json.duration % 60}s`);

      if (this.routeLayer) {
        this.map.removeLayer(this.routeLayer);
      }
      this.routeLayer = L.geoJSON(json.geometry, {
      }).addTo(this.map);

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
        'lang': 'pl',
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

      this.markersLayer = L.geoJSON(featureCollection, {
        pointToLayer: (feature, latlng) => {
          return L.marker(latlng, { icon: L.Marker.prototype.getIcon()});
        }
      }).addTo(this.map);

      const bboxCoords = this.bbox(json.items.map((item: any) => ([item.position.lon, item.position.lat])));
      // console.log(json.items.map((item: any) => ([item.position.lon, item.position.lat])))
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

  autocomplete(elementId: string, setPlaceCallback: (data: any) => void): void {
    const inputElem = document.querySelector(`#${elementId}`) as HTMLInputElement | null;

    if (!inputElem) {
      console.error('Input element not found');
      return;
    }

    new AutoComplete({
      selector: () => inputElem,
      searchEngine: (query: string, record: any) => `<mark>${record}</mark>`,
      data: {
        keys: ["value"],
        src: async (query: string) => {
          try {
            const fetchData = await fetch(`https://api.mapy.cz/v1/suggest?lang=pl&limit=5&apikey=${this.API_KEY}&query=${query}`);
            const jsonData = await fetchData.json();
            return jsonData.items.map((item: any) => ({
              value: item.name,
              data: item,
            }));
          } catch (exc) {
            console.log(exc);
            return [];
          }
        },
        cache: false,
      },
      resultItem: {
        element: (item: HTMLElement, data: any) => {
          const itemData = data.value.data;
          const desc = document.createElement("div");
          desc.style.overflow = "hidden";
          desc.style.whiteSpace = "nowrap";
          desc.style.textOverflow = "ellipsis";
          desc.innerHTML = `${itemData.label}, ${itemData.location}`;
          item.append(desc);
        },
        highlight: true
      },
      resultsList: {
        element: (list: HTMLElement, data: { results: any[], query: string }) => {
          list.style.maxHeight = "max-content";
          list.style.overflow = "hidden";

          if (!data.results.length) {
            const message = document.createElement("div");
            message.setAttribute("class", "no_result");
            message.style.padding = "5px";
            message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
            list.prepend(message);
          } else {
            const logoHolder = document.createElement("div");
            const text = document.createElement("span");
            const img = new Image();

            logoHolder.style.padding = "5px";
            logoHolder.style.display = "flex";
            logoHolder.style.alignItems = "center";
            logoHolder.style.justifyContent = "end";
            logoHolder.style.gap = "5px";
            logoHolder.style.fontSize = "12px";
            text.textContent = "Powered by";
            img.src = "https://api.mapy.cz/img/api/logo-small.svg";
            img.style.width = "60px";
            logoHolder.append(text, img);
            list.append(logoHolder);
          }
        },
        noResults: true,
      },
    });

    inputElem.addEventListener("selection", (event: any) => {
      const origData = event.detail.selection.value.data;
      inputElem.value = origData.name;

      const lat = parseFloat(origData.position.lat);
      const lon = parseFloat(origData.position.lon);

      if (isNaN(lat) || isNaN(lon)) {
        console.error("Invalid latitude or longitude");
        return;
      }

      setPlaceCallback({ lat, lon, name: origData.name });
      const offset: [number, number] = [0, 0]; // Adjust the offset as needed
      this.map.setView([lat, lon], 16, { animate: true });
      this.map.panBy(offset, { animate: true });
    });
  }

  setStartPlace(data: { lat: number; lon: number; name: string }) {
    this.startPlace = [data.lat, data.lon];
    L.marker([data.lat, data.lon], { icon: this.setMarkerIcon() }).addTo(this.map).bindPopup(`Start: ${data.name}`).openPopup();
  }

  setEndPlace(data: { lat: number; lon: number; name: string }) {
    this.endPlace = [data.lat, data.lon];
    L.marker([data.lat, data.lon], { icon: this.setMarkerIcon() }).addTo(this.map).bindPopup(`End: ${data.name}`).openPopup();
  }

  // autocomplete(): void {
  //   const inputElem = document.querySelector("#autoComplete") as HTMLInputElement | null;
  //
  //   if (!inputElem) {
  //     console.error('Input element not found');
  //     return;
  //   }
  //
  //   const autoCompleteJS = new AutoComplete({
  //     selector: () => inputElem,
  //     placeHolder: "Enter your address...",
  //     searchEngine: (query: string, record: any) => `<mark>${record}</mark>`,
  //     data: {
  //       keys: ["value"],
  //       src: async (query: string) => {
  //         try {
  //           const fetchData = await fetch(`https://api.mapy.cz/v1/suggest?lang=pl&limit=5&apikey=${this.API_KEY}&query=${query}`);
  //           const jsonData = await fetchData.json();
  //           return jsonData.items.map((item: any) => ({
  //             value: item.name,
  //             data: item,
  //           }));
  //         } catch (exc) {
  //           console.log(exc);
  //           return [];
  //         }
  //       },
  //       cache: false,
  //     },
  //     resultItem: {
  //       element: (item: HTMLElement, data: any) => {
  //         const itemData = data.value.data;
  //         const desc = document.createElement("div");
  //         desc.style.overflow = "hidden";
  //         desc.style.whiteSpace = "nowrap";
  //         desc.style.textOverflow = "ellipsis";
  //         desc.innerHTML = `${itemData.label}, ${itemData.location}`;
  //         item.append(desc);
  //       },
  //       highlight: true
  //     },
  //     resultsList: {
  //       element: (list: HTMLElement, data: { results: any[], query: string }) => {
  //         list.style.maxHeight = "max-content";
  //         list.style.overflow = "hidden";
  //
  //         if (!data.results.length) {
  //           const message = document.createElement("div");
  //           message.setAttribute("class", "no_result");
  //           message.style.padding = "5px";
  //           message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
  //           list.prepend(message);
  //         } else {
  //           const logoHolder = document.createElement("div");
  //           const text = document.createElement("span");
  //           const img = new Image();
  //
  //           logoHolder.style.padding = "5px";
  //           logoHolder.style.display = "flex";
  //           logoHolder.style.alignItems = "center";
  //           logoHolder.style.justifyContent = "end";
  //           logoHolder.style.gap = "5px";
  //           logoHolder.style.fontSize = "12px";
  //           text.textContent = "Powered by";
  //           img.src = "https://api.mapy.cz/img/api/logo-small.svg";
  //           img.style.width = "60px";
  //           logoHolder.append(text, img);
  //           list.append(logoHolder);
  //         }
  //       },
  //       noResults: true,
  //     },
  //   });
  //
  //   inputElem.addEventListener("selection", (event: any) => {
  //     const origData = event.detail.selection.value.data;
  //     // console.log(origData);
  //     // console.log(typeof origData.position.lat === 'number')
  //     // this.startPlace = [parseFloat(origData.position.lat), parseFloat(origData.position.lon)]
  //     inputElem.value = origData.name;
  //
  //     const lat = parseFloat(origData.position.lat);
  //     const lon = parseFloat(origData.position.lon);
  //
  //     if (isNaN(lat) || isNaN(lon)) {
  //       console.error("Invalid latitude or longitude");
  //       return;
  //     }
  //
  //     L.marker([lat, lon], {icon: this.setMarkerIcon()}).addTo(this.map);
  //     const currentZoom = this.map.getZoom();
  //
  //     const bboxCoords = this.bbox([[lon, lat]]);
  //     this.map.fitBounds(bboxCoords, { padding: [100, 100], maxZoom: currentZoom });
  //   });
  // }
}
