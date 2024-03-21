import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TopBarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  constructor(private router:Router, private userService: UserService) {
    let formControls = {
      name: new FormControl('',[ Validators.required, Validators.nullValidator, Validators.minLength(5)]),
      password: new FormControl('',[ Validators.required, Validators.nullValidator])
    }
    this.form = new FormGroup(formControls);
  }

  onSubmit() {
    // console.log(this.form.value.name)
    // console.log(this.form.value.password)

    this.userService.loginUser(this.form.value).subscribe((data) => {
      let response = data as any;
      console.log(response)
      if(response.body.status === "success") {
        // Navigate to the home page if the user is found
        this.router.navigate(['/']);
      } else if(response.body.status === "failed") {
        alert("User/pass not found.");
        this.router.navigate(['/register']);
      }
    })

  }

  registerUser() {
    this.router.navigate(['/register'])
  }
}
