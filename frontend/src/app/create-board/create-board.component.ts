import { Component } from '@angular/core';
import { TopBarComponent } from "../top-bar/top-bar.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BoardService } from '../board.service';

@Component({
    selector: 'app-create-board',
    standalone: true,
    templateUrl: './create-board.component.html',
    styleUrl: './create-board.component.css',
    imports: [TopBarComponent, ReactiveFormsModule]
})
export class CreateBoardComponent {
    form: FormGroup
    constructor(private boardService: BoardService) {
        let formControls = {
            title: new FormControl('',[ Validators.required, Validators.nullValidator, ]),
            description: new FormControl('',[ Validators.required, Validators.nullValidator]),
          }
          this.form = new FormGroup(formControls);
    }

    onSubmit() {
        console.log(this.form.value.title);
        console.log(this.form.value.description);
        this.boardService.addBoard1(this.form.value.title, this.form.value.description).subscribe((data) => {
            let response = data as any;
          })
    }
}
