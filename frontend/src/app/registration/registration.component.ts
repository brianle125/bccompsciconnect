import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  form: FormGroup;
  constructor(private router:Router) {
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

    
    this.router.navigate(['/register'])
  }

  loginUser() {
      this.router.navigate(['/login'])
  }
}



