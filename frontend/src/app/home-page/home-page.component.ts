import { Component } from '@angular/core';
import { BoardList } from "../board-list/board-list.component";
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
    selector: 'app-home-page',
    standalone: true,
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.css',
    imports: [BoardList, TopBarComponent]
})
export class HomePageComponent {

}
