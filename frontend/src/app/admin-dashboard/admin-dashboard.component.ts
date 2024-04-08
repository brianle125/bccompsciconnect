import { Component, OnInit } from '@angular/core';
import { TopBarComponent } from "../top-bar/top-bar.component";
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css',
    imports: [TopBarComponent, CommonModule, ReactiveFormsModule]
})
export class AdminDashboardComponent implements OnInit {
   username: string | undefined;
   users: { id: string; username: string; email: string; role: string; }[] = [];
   form: FormGroup;
   editUsername: string;
   editRole: string;
   editId: string;
   currentUser:any;
   clicked:boolean;
  constructor(private userService: UserService, private router: Router){
    let formControls = {
      username: new FormControl('',[ Validators.required, Validators.nullValidator, Validators.email]),
      role: new FormControl('',[ Validators.required, Validators.nullValidator]),
    }
    this.form = new FormGroup(formControls);
    this.editUsername = "";
    this.editRole = "";
    this.editId = "";
    this.clicked = false;
  }
  ngOnInit(): void {
    this.userService.isLoggedIn().subscribe((data) => {
      let response = data as any
      this.username = response.user;
    })

    this.userService.getUsers().subscribe((data) => {
      let response = data as any
      response.body.forEach((user: any) => {
        this.users.push({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        });
      });
    })
  }

  deleteUser(userId: string) {
    this.userService.deleteUser({id: userId}).subscribe((data) => {
      let response = data as any;
    })
    window.location.reload()
  }

  editUser(userId: string) {
    const foundUser = this.users.find(user => user.id === userId);
    if (foundUser) {
      console.log("Found user:", foundUser);
      this.clicked = true;
      this.editUsername = foundUser.username;
      this.editRole = foundUser.role;
      this.currentUser = foundUser;
   }
  }

  onSubmit() {
    this.form.value.id = this.currentUser.id;
    if(this.form.value.username == '') {
        this.form.value.username = this.currentUser.username;
    }

    if(this.form.value.role == '') {
      this.form.value.role = this.currentUser.role;
    }
    
    this.userService.editUser1(this.form.value).subscribe((data) => {
      let response = data as any;
    })
    
    window.location.reload()
    
  }
}
