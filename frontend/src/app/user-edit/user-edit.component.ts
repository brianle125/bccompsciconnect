import { Component } from '@angular/core';
import { NgForm, FormsModule, FormControl, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {
  form: FormGroup
  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
    let formControls = {
      username: new FormControl('',[ Validators.required, Validators.nullValidator, Validators.minLength(5)]),
      email: new FormControl('',[ Validators.required, Validators.nullValidator, Validators.email]),
      password: new FormControl('',[ Validators.required, Validators.nullValidator, Validators.minLength(5)]),
      description: new FormControl('',[ Validators.required, Validators.nullValidator, Validators.minLength(0)])
    }
    this.form = new FormGroup(formControls)
  }

  onSubmit() {
    const routeParams = this.route.snapshot.paramMap;
    const username = routeParams.get('username');

    if (this.form.invalid) {
      return;
    }
    //Update user's info
    this.userService.editUser(username, this.form.value)
    this.form.reset()
    this.router.navigate([`/user/${username}`])
  }
}
