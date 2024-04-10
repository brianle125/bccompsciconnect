import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from '../board.service';
import { ActivatedRoute } from '@angular/router';
import { unixTimeStampStringToDate } from '../helpers';
import { UserService } from '../user.service';
import { TopicService } from '../topic.service';
import { last } from 'rxjs';

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topic-list.component.html',
  styleUrl: './topic-list.component.css'
})
/**
 * Component to list topics
 */
export class TopicListComponent implements OnInit {
  @Input() topics: TopicListEntry[] = []
  public loggedIn = false;
  public isAdmin = false;
  public loggedInUser = "";
  constructor(private userService: UserService, private topicService: TopicService) {
  }

  ngOnInit() {
    this.userService.isLoggedIn().subscribe((data: any) => {
      this.loggedIn = data.loggedIn;
      this.isAdmin = data.role === 'admin';
      this.loggedInUser = data.user;
      console.log(data)
    });
  }

  deleteTopic(data: any) {
      console.log(data.link);
      const topicId = parseInt(data.link);
      const lastChar = data.link.charAt(data.link.length - 1);
      console.log(parseInt(lastChar));
      this.topicService.deleteTopic(parseInt(lastChar)).subscribe((data:any)=> {
          
      })
      window.location.reload()
  }
}

export class TopicListEntry {
  constructor(
    public title: string,
    public originalPoster: string,
    public views: number,
    public numberOfReplies: number,
    public created: Date,
    public lastUpdated: Date,
    public link: string
  ) {}
}