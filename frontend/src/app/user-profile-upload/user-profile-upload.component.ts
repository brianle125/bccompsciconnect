import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-upload.component.html',
  styleUrl: './user-profile-upload.component.css'
})
export class UserProfileUploadComponent implements OnInit{

  @Input() requiredFileType:string = ''
  user: any
  fileName = '';
  loggedAsUser: boolean = false;
  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    //load user
    const routeParams = this.route.snapshot.paramMap;
    const username = routeParams.get('username');
    this.userService.getUser(username).subscribe((data) => {
      this.user = data as any
    })

    //Users can only edit their own profile
    this.userService.isLoggedIn().subscribe((data) => {
      let response = data as any
      console.log(response)
      if(response.loggedIn && response.user === username) {
        this.loggedAsUser = true;
      }
    })
  }

  onFileSelected(event: any) {
    const file:File = event.target.files[0];

    if(file.size > 2097152) {
      alert("Maximum file size is 2MB")
    } else if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("userid", this.user[0].id)
      formData.append("filename", this.fileName)
      formData.append("url", "")
      formData.append("image", file);
      console.log(file.name)
      this.userService.uploadUserProfile(formData).subscribe()
      window.location.reload();
    }

  }
}
