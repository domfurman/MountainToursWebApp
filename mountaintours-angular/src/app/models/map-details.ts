export class MapDetails {
  tourId = 0;
  ownerId: number = 0;
  startPlace: number[] = [];
  endPlace: number[] = [];
  waypoints: [number, number][] = [];
  length: number = 0;
  duration: number = 0;
  driverStartingPoint: string = '';
  mapDifficultyLevel: string = '';
  tourDate: Date = new Date();
  numberOfSpots: number = 0;
  participationCosts: number = 0;
  creationDate: Date = new Date();
  expirationDate: Date = new Date();
}
