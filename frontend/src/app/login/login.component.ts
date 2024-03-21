import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
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
      if(response.status === "success") {
        this.router.navigate(['/'])
      }
    })

    //CHECK IF USER EXITS IF THEY DO SEND BACK TO
    this.router.navigate(['/login'])
  }

  registerUser() {
    this.router.navigate(['/register'])
  }
}
