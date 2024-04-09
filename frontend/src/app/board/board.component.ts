import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicListComponent, TopicListEntry } from '../topic-list/topic-list.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { BoardService } from '../board.service';
import { unixTimeStampStringToDate } from '../helpers';
import { LinkData, ListOfLinksComponent } from '../list-of-links/list-of-links.component';
import { forkJoin } from 'rxjs';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TopicListComponent, TopBarComponent, ListOfLinksComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
/**
 * The main page for a board
 */
export class BoardComponent implements OnInit {
  public boardId: number | null = null
  public createTopicLink: string | null = null;
  public topics: TopicListEntry[] = []
  public navLinks: LinkData[] = []
  public boardTitle: string = ''
  public description: string = ''
  public loggedIn: boolean = false

  // constructor for the route that creates topics
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private boardService: BoardService, private userService: UserService) {}
  ngOnInit(): void {
    let tempBoardID: string | null = this.activatedRoute.snapshot.params['board-id']
    if(tempBoardID == null || Number.isNaN(tempBoardID)) {
      this.router.navigate(['/'])
      return
    }

    this.boardId = parseInt(tempBoardID)
    this.createTopicLink = `board/${this.boardId}/create-topic`

    forkJoin({user: this.userService.isLoggedIn(), board: this.boardService.getBoard(this.boardId)}).subscribe({
      next: (data) => {
        console.log(data)
        // logged in
        this.loggedIn = data.user.loggedIn

        // set up title and description
        let board = data.board.board
        this.boardTitle = board.title
        this.description = board.description
  
        // set up nav links
        this.navLinks = [
          new LinkData('BcCompSciConnect', '/'), 
          new LinkData(this.boardTitle, `board/${this.boardId}`)
        ]
  
        // set up topic list
        let tempTopics: TopicListEntry[] = []
        for(let i = 0; i < data.board.topics.length; i++) {
          let target = data.board.topics[i]
          tempTopics.push(new TopicListEntry(
            target.question, 
            target.username, 
            target.num_views, 
            target.num_replies, 
            unixTimeStampStringToDate(target.created_at_unix), 
            unixTimeStampStringToDate(target.latest_post_unix), 
            `/board/${this.boardId}/topic/${target.id}`
          ))
          this.topics = tempTopics
        }
      }
    })

    // this.boardService.getBoard(this.boardId).subscribe((data) => {
    //   console.log(data)
    //   // set up title and description
    //   let board = data.board
    //   this.boardTitle = board.title
    //   this.description = board.description

    //   // set up nav links
    //   this.navLinks = [
    //     new LinkData('BcCompSciConnect', '/'), 
    //     new LinkData(this.boardTitle, `board/${this.boardId}`)
    //   ]

    //   // set up topic list
    //   let tempTopics: TopicListEntry[] = []
    //   for(let i = 0; i < data.topics.length; i++) {
    //     let target = data.topics[i]
    //     tempTopics.push(new TopicListEntry(
    //       target.question, 
    //       target.username, 
    //       target.num_views, 
    //       target.num_replies, 
    //       unixTimeStampStringToDate(target.created_at_unix), 
    //       unixTimeStampStringToDate(target.latest_post_unix), 
    //       `/board/${this.boardId}/topic/${target.id}`
    //     ))
    //     this.topics = tempTopics
    //   }
    // })
  }



  // navigateToTopicCreate() {
  //   this.router.navigate(['/create-topic']);
  // }
}
