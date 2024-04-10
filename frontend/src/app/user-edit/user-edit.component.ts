import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  NgForm,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { UserProfileData } from '../user-profile/user-profile.component';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent implements OnInit {
  form: FormGroup;
  username: string | null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    //Will more than likely need a cleaner way of loading default values into form
    const routeParams = this.route.snapshot.paramMap;
    const username = routeParams.get('username');
    this.username = username;

    let formControls = {
      username: new FormControl(username, [
        Validators.required,
        Validators.nullValidator,
        Validators.minLength(5),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
        Validators.minLength(5),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
        Validators.minLength(0),
      ]),
    };
    this.form = new FormGroup(formControls);
  }

  ngOnInit(): void {
    //Navigate to login if user doesn't exist in database
    this.userService.checkUserExists(this.username).subscribe((data) => {
      let response = data as any;
      console.log(response.exists);
      if (!response.exists) {
        this.router.navigate(['/login']);
      }
    });

    //Load current profile details
    this.userService.getUser(this.username).subscribe((data) => {
      let response = data as any;
      let user = response[0];

      let formControls = {
        username: new FormControl(this.username, [
          Validators.required,
          Validators.nullValidator,
          Validators.minLength(5),
        ]),
        email: new FormControl(user.email, [
          Validators.required,
          Validators.nullValidator,
          Validators.email,
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.nullValidator,
          Validators.minLength(5),
        ]),
        description: new FormControl(user.description, [
          Validators.required,
          Validators.nullValidator,
          Validators.minLength(0),
        ]),
      };
      this.form = new FormGroup(formControls);
    });
  }

  onSubmit() {
    const routeParams = this.route.snapshot.paramMap;
    const username = routeParams.get('username');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    //If username belongs to someone else stop edit, otherwise continue
    this.userService.isLoggedIn().subscribe((data) => {
      let response = data as any;
  
      this.userService
        .checkUserExists(this.form.value.username)
        .subscribe((data) => {
          let exists = data as any;
          if (exists.exists && response.user !== this.form.value.username) {
            alert('Username is taken');
            this.form.reset();
          } else {
            this.userService.checkEmailExists(this.form.value.email).subscribe((data) => {
              let exists = data as any;
              if(exists.exists === true && response.email !== this.form.value.email) {
                alert('Email is taken')
                this.form.reset();
                this.router.navigate([`/user/${username}/edit`])
              } else {
                this.userService
              .editUserProfile(username, this.form.value)
              .subscribe();
            this.router
              .navigate([`/user/${this.form.value.username}`])
              .then(() => {
                alert('User details successfully edited!');
                window.location.reload();
              });
              }
            })

          }
        });
    });
    

    //Otherwise edit is granted
  }

  cancelEdit() {
    this.router.navigate([`/user/${this.username}`]);
  }
}
