import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  preloadImages(images: string[]): Promise<void[]> {
    const promises: Promise<void>[] = [];
    images.forEach((image) => {
      const promise = new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.src = image;
      });
      promises.push(promise);
    });
    return Promise.all(promises);
  }
}
