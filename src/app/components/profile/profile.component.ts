import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {FirebaseService} from "../../services/firebase.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user: User
  isLoading = true

  constructor(private firebaseService: FirebaseService) {
  }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    const userObject = JSON.parse(userString);
    this.firebaseService.getUserProfile(userObject.email).subscribe((data) => {
      this.user = data
      if (this.user === undefined) {
        this.isLoading = true

      } else {
        this.isLoading = false

      }

    })

  }

}
