import {Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {

  isDropdownActive: boolean = false;

  dropdown(event: Event) {
    event.preventDefault();
    this.isDropdownActive = !this.isDropdownActive;
  }

}
