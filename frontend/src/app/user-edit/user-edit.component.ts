import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule, FormControl, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { UserProfileData } from '../user-profile/user-profile.component';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {
  form: FormGroup
  username: string | null
  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
    //Will more than likely need a cleaner way of loading default values into form
    const routeParams = this.route.snapshot.paramMap;
    const username = routeParams.get('username');
    this.username = username

    let formControls = {
      username: new FormControl(username,[ Validators.required, Validators.nullValidator, Validators.minLength(5)]),
      email: new FormControl('',[ Validators.required, Validators.nullValidator, Validators.email]),
      currentPassword: new FormControl('', [ Validators.required, Validators.nullValidator]),
      password: new FormControl('',[ Validators.required, Validators.nullValidator, Validators.minLength(5)]),
      description: new FormControl('',[ Validators.required, Validators.nullValidator, Validators.minLength(0)])
    }
    this.form = new FormGroup(formControls)
  }

  ngOnInit(): void {
    //Navigate to login if user doesn't exist in database
    const routeParams = this.route.snapshot.paramMap;
    const username = routeParams.get('username');
    this.userService.checkUserExists(username).subscribe((data) => {
      let response = data as any
      console.log(response.exists)
      if(!response.exists) {
        this.router.navigate(['/login'])
      }
    })
  }


  onSubmit() {
    const routeParams = this.route.snapshot.paramMap;
    const username = routeParams.get('username');

    if (this.form.invalid) {
      return;
    }
    //TODO: If currentPassword doesn't match the user's password, edit fails

    console.log(this.form.value)
    //Update user's info, make api calls for each attribute
    //this.userService.editUser(username, this.form.value).subscribe()
    
    this.router.navigate([`/user/${this.form.value.username}`]).then(() => {
      alert("User details successfully edited!");
      window.location.reload();
    });
  }

  cancelEdit() {
    this.router.navigate([`/user/${this.username}`])
  }
}
