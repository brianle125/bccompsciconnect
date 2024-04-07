import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { PostListComponent } from '../post-list/post-list.component';
import { UserProfileUploadComponent } from '../user-profile-upload/user-profile-upload.component';
import { arrayBufferToBase64 } from '../image-helper';

@Component({
  selector: 'app-user-profile',
  standalone: true,

  imports: [
    CommonModule,
    TopBarComponent,
    UserEditComponent,
    PostListComponent,
    UserProfileUploadComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  userData: UserProfileData = new UserProfileData(
    'Invalid user',
    'assets/user.png',
    '',
    'Desc',
    ''
  );
  user: any;
  //Session user

  isCurrentUser: boolean = false;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const username = routeParams.get('username');
    this.userService.getUser(username).subscribe((data) => {
      //Get username, profile and related information for display
      this.user = data as any;
      this.userData = new UserProfileData(
        this.user[0].username,
        'assets/user.png',
        this.user[0].email,
        this.user[0].description,
        `/user/${username}/posts`
      );
    });

    this.userService.isLoggedIn().subscribe((data) => {
      let amilogged = data as any;
      console.log(amilogged.loggedIn);
    });
  }

  editUser() {
    this.router.navigate([`/user/${this.userData.username}/edit`]);
  }

  //CHECK IF LOGGED IN, AND IF CURRENT SESSION MATCHES THE USER
  addProfilePicture(file: FileList) {
    this.userService.isLoggedIn().subscribe((data) => {});
    //get image
  }
}

export class UserProfileData {
  constructor(
    public username: string = 'name',
    public icon: string = 'assets/page.png',
    public email: string = 'email',
    public description: string = 'Description',
    public postsLink: string = ''
  ) {}
}
