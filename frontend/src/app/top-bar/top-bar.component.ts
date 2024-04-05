import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { arrayBufferToBase64 } from '../image-helper';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent implements OnInit {
  loggedIn: boolean = false;
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
      //load profile picture
      if(this.loggedIn) {
        this.userService.getUserProfile(response.id).subscribe((data) => {
          let response = data as any;
          if(response.length !== 0) {
            this.profilePic = 'data:image/jpg;base64,' + arrayBufferToBase64(response[0].image.data)
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

