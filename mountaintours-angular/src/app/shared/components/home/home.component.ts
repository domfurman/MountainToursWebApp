import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from "../../models/user";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {NavbarComponent} from "../navbar/navbar.component";
import {NgIf} from "@angular/common";
import {SharedService} from "../../services/shared.service";
import {interval} from "rxjs";
import Typed from 'typed.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('slidesImages') slidesImagesRef!: ElementRef;
  @ViewChild('navbar') navbarRef!: ElementRef;

  user: User = new User();
  backgroundImages: string[] = [
    "/assets/images/background-images/bg2.jpg",
    "/assets/images/background-images/bg6.jpg",
    "/assets/images/background-images/bg8.jpg",
    "/assets/images/background-images/bg9.jpg",
    "/assets/images/background-images/bg10.jpg",
    "/assets/images/background-images/bg11.jpg",
    "/assets/images/background-images/bg12.jpg",
    "/assets/images/background-images/bg13.jpg",
    "/assets/images/background-images/bg14.jpg",
    "/assets/images/background-images/bg15.jpg",
  ]

  constructor(protected authService: AuthService, private router: Router, private sharedService: SharedService) {
  }

  ngOnInit() {
    this.retrieveUserData();
    this.switchImage();
    interval(10000).subscribe(() => {
      this.switchImage();
    })
    this.typed();
    console.log(this.authenticated());
  }

  ngAfterViewInit() {
    this.adjustContentMargin();
    window.addEventListener('resize', this.adjustContentMargin.bind(this));
  }

  adjustContentMargin() {
    const navbarHeight = this.navbarRef.nativeElement.offsetHeight;
    const contentElement = this.slidesImagesRef.nativeElement;
    contentElement.style.marginTop = `${navbarHeight}px`;
  }

  authenticated() {
    return this.authService.isAuthenticated();
  }

  retrieveUserData() {
    this.authService.getPrincipal().subscribe((user => {
      this.user = user
      console.log(this.user)
    }))
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  preloadImages(images: string[]): Promise<void[]> {
    return this.sharedService.preloadImages(images);
  }

  async switchImage() {
    const randomIndex = Math.floor(Math.random() * this.backgroundImages.length);
    await this.preloadImages([this.backgroundImages[randomIndex]]);
    const bgImagesContainer = document.querySelector('#slides') as HTMLElement;
    if (bgImagesContainer) {
      bgImagesContainer.classList.add('fade-out');
      setTimeout(() => {
        bgImagesContainer.style.backgroundImage = `url(${this.backgroundImages[randomIndex]})`;
        bgImagesContainer.classList.remove('fade-out');
      }, 500);
    }
  }

  typed() {
    let typed = new Typed('#typed', {
      strings: ['Explore.','Make memories.', 'Experience.', 'Meet.'],
      typeSpeed: 125,
      loop: true,
      backSpeed: 125,
      backDelay: 500
    })
  }

}
