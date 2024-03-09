import { Component } from '@angular/core';
import { PageBarListComponent } from "../page-bar-list/page-bar-list.component";

@Component({
    selector: 'app-home-page',
    standalone: true,
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.css',
    imports: [PageBarListComponent]
})
export class HomePageComponent {

}
