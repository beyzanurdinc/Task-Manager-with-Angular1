import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggindIn: boolean = false
  menuState: boolean = false
  subscription: Subscription

  constructor(private authservice: AuthService) {

  }

  ngOnInit(): void {
    this.subscription = this.authservice.loginState.subscribe((condition) => {
      if (condition) {
        this.isLoggindIn = true
      } else {
        this.isLoggindIn = false

      }
    })

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  OnLogout() {
    this.authservice.logout()
  }

  toggleMenu() {
    this.menuState = !this.menuState
  }
}
