import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { PostListComponent } from '../post-list/post-list.component';
import { UserProfileUploadComponent } from '../user-profile-upload/user-profile-upload.component';
import { arrayBufferToBase64 } from '../helpers';
import { HttpClient } from '@angular/common/http';
import { PostService } from '../post.service';

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
  imageurl: any;
  isCurrentUser: boolean = false;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const username = routeParams.get('username');

    //Users can only edit their own profiles
    this.userService.isLoggedIn().subscribe((data) => {
      let response = data as any;
      if(response.loggedIn && response.user === username)
      {
        this.isCurrentUser = true;
      }
    })


    if (username) {
      this.userService.getUser(username).subscribe((data) => {
        // Assuming you have the user data
        this.user = data as any;
        if(this.user.length === 0) {
          return;
        }

        //Load user data
        this.userData = new UserProfileData(
          this.user[0].username,
          'assets/user.png',
          this.user[0].email,
          this.user[0].description,
          `/user/${username}/posts`
        );
        

        // Check if the icon needs conversion (i.e., it's a Blob)
        if(this.user[0].profile_image !== null) {
          if(this.user[0].profile_image.type === 'Buffer') {
            this.userData.icon = 'data:image/jpg;base64,' + arrayBufferToBase64(this.user[0].profile_image.data)
          } 
        }
      });
    }
    
  }

  editUser() {
    this.router.navigate([`/user/${this.userData.username}/edit`]);
  }

  goToPosts() {
    this.router.navigate([`/user/${this.userData.username}/posts`])
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
