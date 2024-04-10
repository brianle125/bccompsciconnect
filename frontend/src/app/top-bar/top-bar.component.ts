import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { arrayBufferToBase64 } from '../helpers';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
/**
 * The navigation bar at the top of most screens
 */
export class TopBarComponent implements OnInit {
  loggedIn: boolean = false;
  isAdmin: boolean = false;
  username: string = 'user'
  profilePic: string = 'assets/user.png'
  profileLink: string = ''
  messagesLink: string = ''
  logoutLink: string = ''
  numUnReads: number = 0

  constructor(private userService: UserService){}

  ngOnInit(): void {
    this.userService.isLoggedIn().subscribe((data) => {
      let response = data as any
      this.loggedIn = response.loggedIn;
      this.username = response.user;
      this.isAdmin = response.role === 'admin'

      console.log(response)

      //load profile picture
      if(this.loggedIn) {
        this.userService.getUserProfile(response.user).subscribe((data) => {
          let retrievedImage = data as any;
          if(retrievedImage[0].profile_image !== null) {
            this.profilePic = 'data:image/jpg;base64,' + arrayBufferToBase64(retrievedImage[0].profile_image.data)
          } else {
            this.profilePic = 'assets/user.png'
          }
        })
      }
      this.profileLink = `/user/${this.username}`
    })

  }
  
  logOut() {
    this.userService.isLoggedIn().subscribe((data) => {
      let response = data as any
      console.log(response)
    })
    console.log("Logging out")
    this.userService.logoutUser().subscribe()
  }
}

