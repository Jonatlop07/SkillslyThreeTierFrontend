import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Comment } from 'src/app/interfaces/presenter/comment.presenter';
import { PermanentPostPresenter } from 'src/app/interfaces/presenter/query_post.presenter';
import {
  QueryReactionsReactors,
  Reactor,
} from 'src/app/interfaces/presenter/query_reactions.presenter';
import { CommentsService } from 'src/app/services/comments.service';
import { ReactionService } from 'src/app/services/reaction.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: PermanentPostPresenter;
  public showComments = false;
  public postComments: Array<Comment> = [];
  public comment: string;
  public page = 0;
  public limit = 2;
  public reactionTypes = ['like', 'fun', 'interested'];
  public display = false;
  public items: MenuItem[];
  public reactionCount = 0;
  public reactors: QueryReactionsReactors = {
    likes: { reaction_count: 0, reactors: [] },
    interested: { reaction_count: 0, reactors: [] },
    fun: { reaction_count: 0, reactors: [] },
  };
  public reacted = false;

  constructor(
    private commentsService: CommentsService,
    private reactionsService: ReactionService
  ) {}

  ngOnInit(): void {
    this.getComments();
    this.items = [
      { label: 'Me gusta', icon: 'pi pi-fw pi-thumbs-up' },
      { label: 'Me interesa', icon: 'pi pi-fw pi-question-circle' },
      { label: 'Hahaha' },
    ];
    this.reactionsService.queryReactions(this.post.post_id).subscribe(
      (reactors) => {
        this.reactors = reactors;
        this.reactionCount = this.getReactionCount(this.reactors);
        this.hasReacted();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isImage(referenceType: string): boolean {
    if (referenceType == 'image') {
      return true;
    }
    return false;
  }

  handleShowComments() {
    this.showComments = !this.showComments;
  }

  sendComment() {
    if (this.comment) {
      this.commentsService
        .sendComment(this.post.post_id, this.comment)
        .subscribe(
          () => {
            this.comment = '';
            this.ngOnInit();
          },
          (err) => {
            console.log(err.status);
          }
        );
    }
  }

  handleMoreComments() {
    this.limit = 10;
    this.getComments();
    this.page += 1;
  }

  resetComments() {
    this.page -= 1;
    if (this.page === 0) {
      this.limit = 2;
    } else {
      this.limit = 10;
    }
    this.getComments();
  }

  getComments(page = this.page, limit = this.limit) {
    this.commentsService.getComments(this.post.post_id, page, limit).subscribe(
      (comments: any) => {
        this.postComments = comments;
      },
      (err) => {
        if (err.status === 404) {
          this.postComments = [];
        }
      }
    );
  }

  showDialog() {
    this.display = !this.display;
  }

  onAddReaction(type: string, postId: string) {
    this.reactionsService.addReaction(type, postId).subscribe(
      () => {
        this.onQueryReactions();
      }
    );
    
  }

  onQueryReactions() {
    this.reactionsService.queryReactions(this.post.post_id).subscribe(
      (reactors) => {
        this.reactors = reactors;
        this.reactionCount = this.getReactionCount(this.reactors);
        this.hasReacted();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getReactionCount(reactions: QueryReactionsReactors) {
    return (
      reactions.fun.reaction_count +
      reactions.interested.reaction_count +
      reactions.likes.reaction_count
    );
  }

  hasReacted() {
    const email = localStorage.getItem('email');
    if (
      this.existsReactor(email, this.reactors['likes'].reactors) ||
      this.existsReactor(email, this.reactors['interested'].reactors) ||
      this.existsReactor(email, this.reactors['fun'].reactors)
    ) {
      this.reacted = true;
    } else {
      this.reacted = false;
    }
  }

  queryReactions() {
    this.showDialog();
    this.onQueryReactions();
  }

  existsReactor(email: string, reactors: Reactor[]) {
    for (const reactor of reactors) {
      if (reactor.email === email) {
        return true;
      }
    }
    return false;
  }
}
