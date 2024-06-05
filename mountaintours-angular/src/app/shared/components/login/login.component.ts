import {Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {Credentials} from "../../interfaces/credentials";
import {RegistrationCredentials} from "../../interfaces/registration-credentials";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {interval} from "rxjs";
import {SharedService} from "../../services/shared.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit{
  @ViewChild('bgImages') bgImagesRef!: ElementRef;


  credentials: Credentials = {
    email: '',
    password: ''
  }

  registrationCredentials: RegistrationCredentials = {
    firstName: '',
    lastName: '',
    password:'',
    email: ''
  }

  sessionId: any = '';
  showLoginForm = false;

  backgroundImages: string[] = [
    "/assets/images/background-images/bg1.jpg",
    "/assets/images/background-images/bg2.jpg",
    "/assets/images/background-images/bg3.jpg",
    "/assets/images/background-images/bg4.jpg",
    "/assets/images/background-images/bg5.jpg",
    "/assets/images/background-images/bg6.jpg",
    "/assets/images/background-images/bg7.jpg",
    "/assets/images/background-images/bg8.jpg"
  //   "https://images.unsplash.com/photo-1663524962567-a584dd70450c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   "https://images.unsplash.com/photo-1613756441952-5cd67d628090?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   "https://images.unsplash.com/photo-1663524963808-69de5d277ca8?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   "https://images.unsplash.com/photo-1663524962760-2155d763cefc?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   "https://images.unsplash.com/photo-1663524962383-3dffa910967c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   "https://images.unsplash.com/photo-1663524963302-dd3321d69294?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   "https://images.unsplash.com/photo-1507975140808-424c25c0c3a7?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
]

  constructor(private authService: AuthService, private router: Router, private renderer: Renderer2, private sharedService: SharedService) {
  }

  ngOnInit(): void {
    // this.sharedService.preloader();
    this.switchBackgroundImage();
    interval(10000).subscribe(() => {
      this.switchBackgroundImage();
    });
    this.renderer.listen(this.bgImagesRef.nativeElement, 'click', (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement;
      if (!targetElement.closest('#loginForm') && !targetElement.closest('#registrationForm')) {
        this.setFormOpacity(0.85);
      }
    });
  }

  // userLogin() {
  //   this.authService.login(this.credentials.email, this.credentials.password).subscribe(res => {
  //     this.sessionId = res.sessionId
  //     sessionStorage.setItem(
  //       'token',
  //       this.sessionId
  //     );
  //   }, error => {
  //     console.log('Login error: ', error)
  //   })
  // }
  userLogin() {
    this.authService.login(this.credentials.email, this.credentials.password).subscribe(res => {
      if (this.authService.authenticated) {
        this.sessionId = res.sessionId;
        sessionStorage.setItem('token', this.sessionId);
        Swal.fire({
          title: 'Sign in successful',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/home']);
          }
        });
      }
    }, error => {
      console.log('Login error: ', error);
      Swal.fire({
        title: 'Error',
        text: "Login failed. Please try again.",
        icon: 'error',
        confirmButtonText: 'OK',
      });
    });
  }

  userRegistration() {
    this.authService.registerUser(
      this.registrationCredentials.firstName,
      this.registrationCredentials.lastName,
      this.registrationCredentials.email,
      this.registrationCredentials.password).subscribe(res => {
      this.changeForm();
    }, error => {
      console.log(error)
    })
  }

  changeForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  async switchBackgroundImage(): Promise<void> {
    const randomIndex = Math.floor(Math.random() * this.backgroundImages.length);
    await this.preloadImages([this.backgroundImages[randomIndex]]);
    const bgImagesContainer = document.querySelector('.bg-images') as HTMLElement;
    if (bgImagesContainer) {
      bgImagesContainer.classList.add('fade-out');
      setTimeout(() => {
        bgImagesContainer.style.backgroundImage = `url(${this.backgroundImages[randomIndex]})`;
        bgImagesContainer.classList.remove('fade-out');
      }, 500);
    }
  }

  handleBackgroundClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#loginForm') && !targetElement.closest('#registrationForm')) {
      this.setFormOpacity(0.85);
    }
  }

  setFormOpacity(opacity: number) {
    const formElements = document.querySelectorAll('#loginForm, #registrationForm');
    formElements.forEach((form: Element) => {
      const element = form as HTMLElement;
      element.style.opacity = opacity.toString();
    });
  }

  handleFormClick(): void {
    this.setFormOpacity(1);
  }

  preloadImages(images: string[]): Promise<void[]> {
    return this.sharedService.preloadImages(images);
  }

  signInAlert() {
    if (!this.credentials.email || !this.credentials.password) {
      Swal.fire({
        title: 'Error',
        text: "Please fill in all fields.",
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return
    }

    Swal.fire({
      title: 'Sign in successful',
      // text: "You can now log in.",
      icon: 'success',
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userLogin();
        this.router.navigate(['/home']);
      }
    });
  }

  signUpAlert() {
    if (!this.registrationCredentials.email || !this.registrationCredentials.firstName || !this.registrationCredentials.lastName || !this.registrationCredentials.password) {
      Swal.fire({
        title: 'Error',
        text: "Please fill in all fields.",
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return
    }

    Swal.fire({
      title: 'Sign up successful',
      text: "You can now log in.",
      icon: 'success',
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userRegistration();
        this.changeForm();
      }
    });
  }

}
