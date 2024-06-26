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
  preloader() {
    const preloaderWrapper = document.querySelector('.preloader-wrapper') as HTMLElement;

    window.addEventListener('load', () => {
      preloaderWrapper.classList.add('fade-out-animation');
      setTimeout(() => {
        preloaderWrapper.style.display = 'none';
      }, 10000);
    });
  }

}
