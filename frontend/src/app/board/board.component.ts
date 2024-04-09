import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicListComponent, TopicListEntry } from '../topic-list/topic-list.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { BoardService } from '../board.service';
import { unixTimeStampStringToDate } from '../helpers';
import { LinkData, ListOfLinksComponent } from '../list-of-links/list-of-links.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TopicListComponent, TopBarComponent, ListOfLinksComponent],
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

  // constructor for the route that creates topics
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private boardService: BoardService) {}
  ngOnInit(): void {
    let tempBoardID: string | null = this.activatedRoute.snapshot.params['board-id']
    if(tempBoardID == null || Number.isNaN(tempBoardID)) {
      this.router.navigate(['/'])
      return
    }

    this.boardId = parseInt(tempBoardID)
    this.createTopicLink = `board/${this.boardId}/create-topic`

    this.boardService.getBoard(this.boardId).subscribe((data) => {
      console.log(data)
      // set up title and description
      let board = data.board
      this.boardTitle = board.title
      this.description = board.description

      // set up nav links
      this.navLinks = [
        new LinkData('BcCompSciConnect', '/'), 
        new LinkData(this.boardTitle, `board/${this.boardId}`)
      ]

      // set up topic list
      let tempTopics: TopicListEntry[] = []
      for(let i = 0; i < data.topics.length; i++) {
        let target = data.topics[i]
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
    })
  }



  // navigateToTopicCreate() {
  //   this.router.navigate(['/create-topic']);
  // }
}
