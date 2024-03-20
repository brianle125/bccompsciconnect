import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  form: FormGroup;
  constructor(private userService: UserService, private router:Router) {
    let formControls = {
      name: new FormControl('',[ Validators.required, Validators.nullValidator, Validators.minLength(5)]),
      email: new FormControl('',[ Validators.required, Validators.nullValidator, Validators.email]),
      password: new FormControl('',[ Validators.required, Validators.nullValidator, Validators.minLength(5)]),
      confirm_password: new FormControl('',[ Validators.required, Validators.nullValidator])
    }
    this.form = new FormGroup(formControls);
  }

  onSubmit() {
    console.log(this.form.value.name)
    console.log(this.form.value.email)
    console.log(this.form.value.password)
    
    //CHECK IF USER EXITS IF THEY DO SEND BACK TO
    this.userService.getUser(this.form.value.name).subscribe((data) => {
      let exists = data as any;
      console.log('Does it exist?' + exists.exists)
      if(exists.exists === true) {
        this.router.navigate(['/register'])
      } 
      else {
        console.log("ADDING USER")
        this.userService.addUser(this.form.value).subscribe((data) => {
          this.router.navigate(['/']);
        })
      }
    })

  }

  loginUser() {
      this.router.navigate(['/login'])
  }
}



