import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TopBarComponent],
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
    if(this.form.value.confirm_password != this.form.value.password) {
        alert("Passwords do not match.")
        return;
    }
    
    this.userService.checkUserExists(this.form.value.name).subscribe((data) => {
      let exists = data as any;
      console.log('Does it exist?' + exists.exists)
      if(exists.exists === true) {
        alert('Username is taken')
        this.form.reset();
        this.router.navigate(['/register']);
        return;
      } else {
        this.userService.checkEmailExists(this.form.value.email).subscribe((data) => {
          let exists = data as any;
          console.log('Does it exist?' + exists.exists)
          if(exists.exists === true) {
            alert('Email is taken')
            this.form.reset();
            this.router.navigate(['/register'])
            return;
          } else {
            this.userService.addUser(this.form.value).subscribe(() => {
              this.router.navigate(['/']);
            });
          } 
        })
      } 
    })

  }

  loginUser() {
      this.router.navigate(['/login'])
  }
}



