import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  form: FormGroup;
  constructor(private router:Router, private userService: UserService) {
    let formControls = {
      email: new FormControl('',[ Validators.required, Validators.nullValidator, Validators.email]),
      password: new FormControl('',[ Validators.required, Validators.nullValidator])
    }
    this.form = new FormGroup(formControls);
  }

  ngOnInit(): void {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: '1076223145981-qe6hrco26qg188quchbsaffmf9q3requ.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    // @ts-ignore
    google.accounts.id.renderButton(
    // @ts-ignore
    document.getElementById("google-button"),
      { theme: "outline", size: "large", width: "100%" }
    );
    // @ts-ignore
    google.accounts.id.prompt((notification: PromptMomentNotification) => {});
  }
  
  async decodeJWTToken(token: any){
    return JSON.parse(atob(token.split(".")[1]))
  }

  async handleCredentialResponse(response: any) {
    const payload = await this.decodeJWTToken(response.credential)
    console.log(payload);
    this.userService.googleAuthUser(payload).subscribe();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  onSubmit() {
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
    this.userService.logoutUser();
    console.log("logged out");
    this.router.navigate(['/register'])
  }

}
