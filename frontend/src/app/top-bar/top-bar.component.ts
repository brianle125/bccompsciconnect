import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  loggedIn: boolean = false;
  username: string = 'user'
  profilePic: string = 'assets/user.png'
  profileLink: string = ''
  messagesLink: string = ''
  logoutLink: string = ''
  numUnReads: number = 0

  constructor(){}
}
