import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeletePostInterface } from 'src/app/interfaces/post/delete_post.interface';
import { MenuItem } from 'primeng/api';
import { Comment } from 'src/app/interfaces/comments/comment.presenter';
import {
  QueryReactionsReactors,
  Reactor,
} from 'src/app/interfaces/post/query_reactions.presenter';
import { CommentsService } from 'src/app/services/comments.service';
import { PostService } from 'src/app/services/posts.service';
import { ReactionService } from 'src/app/services/reaction.service';
import { PermanentPostPresenter } from 'src/app/interfaces/post/query_post.presenter';
import { Store } from '@ngxs/store';
import { DeleteMyPost } from '../../../shared/state/posts/posts.actions';
import { Router } from '@angular/router';
import { SharePostInterface } from 'src/app/interfaces/post/share_post.interface';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: PermanentPostPresenter;
  @Input() editable: boolean;
  @Input() group_id: string;
  @Input() id: string;
  @Output() toggleDelete = new EventEmitter<string>();

  public showComments = false;
  public postComments: Array<Comment> = [];
  public comment: string;
  public user_name = 'nombre de usuario';
  public page = 0;
  public limit = 2;
  public reactionTypes = ['like', 'fun', 'interested'];
  public display = false;
  public items: MenuItem[];
  public reactionCount = 0;
  public owns_post = false;
  public reactors: QueryReactionsReactors = {
    likes: { reaction_count: 0, reactors: [] },
    interested: { reaction_count: 0, reactors: [] },
    fun: { reaction_count: 0, reactors: [] },
  };
  public reactedLike = false;
  public reactedInterested = false;
  public reactedFun = false;

  constructor(
    private commentsService: CommentsService,
    private reactionsService: ReactionService,
    private postService: PostService,
    private readonly store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.owns_post = this.postService.getUserId() === this.post.owner_id;
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
    return referenceType === 'imagen';
  }

  handleShowComments() {
    this.showComments = !this.showComments;
  }

  deletePost(post_id: string) {
    const deletePostInterface: DeletePostInterface = {
      post_id,
      group_id: this.group_id,
    };
    if (this.group_id) {
      this.postService.deletePost(deletePostInterface).subscribe(() => {
        this.toggleDelete.emit(this.id);
      });
    }
    this.postService.deletePost(deletePostInterface).subscribe(() => {
      this.store.dispatch(new DeleteMyPost(post_id));
    });
  }

  updatePost(post_id: string) {
    this.router.navigate(['main/post/update', post_id]);
  }

  sharePost(post_id: string) {
    const sharePostInterface: SharePostInterface = {
      post_id,
    };
    this.postService
      .sharePost(sharePostInterface)
      .subscribe((resp) => console.log(resp));
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
    this.reactionsService.addReaction(type, postId).subscribe(() => {
      this.onQueryReactions();
    });
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
    const email = this.postService.getIfReactorEmail();
    if (this.existsReactor(email, this.reactors['likes'].reactors)) {
      this.reactedLike = true;
    } else if (
      this.existsReactor(email, this.reactors['interested'].reactors)
    ) {
      this.reactedInterested = true;
    } else if (this.existsReactor(email, this.reactors['fun'].reactors)) {
      this.reactedFun = true;
    } else {
      this.reactedLike = false;
      this.reactedInterested = false;
      this.reactedFun = false;
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
