import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreatePostDataPresenter } from '../interfaces/presenter/post/create_post_data.presenter';
import { toPost } from '../interfaces/presenter/post/post_form_data.presenter';
import { JwtService } from './jwt.service';
import { DeletePostInterface } from '../interfaces/delete_post.interface';
import { QueryPostPresenter } from '../interfaces/presenter/post/query_post.presenter';
import { SharePostInterface } from '../interfaces/share_post.interface';


@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly API_URL: string = environment.API_URL;
  toggleCreate = false;
  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService
  ) { }

  createPost(post: CreatePostDataPresenter) {
    const content = toPost(post);
    return this.http
      .post(
        `${this.API_URL}/permanent-posts`,
        {
          content: content,
        },
        this.jwtService.getHttpOptions()
      )
      .subscribe((created_post) => {
        console.log(created_post);
      });
  }

  queryPostCollection(queryPostParams: QueryPostPresenter) {
    let params = new HttpParams();
    params = params.append('user_id', queryPostParams.user_id);
    return this.http
      .get(
        `${this.API_URL}/permanent-posts`,
        {
          params,
          ...this.jwtService.getHttpOptions(),
        }
      );
  }
  deletePost(deletePostInterface: DeletePostInterface) {
    return this.http
      .delete(
        `${this.API_URL}/permanent-posts/${deletePostInterface.post_id}/delete`,
        this.jwtService.getHttpOptions()
      );
  }

  queryPost(queryPostPresenter: QueryPostPresenter) {
    let params = new HttpParams();
    const id_post = queryPostPresenter.post_id;
    params = params.append('user_id', queryPostPresenter.user_id);
    return this.http
      .get(
        `${this.API_URL}/permanent-posts/${id_post}`,
        {
          params,
          ...this.jwtService.getHttpOptions(),
        }
      );
  }

  sharePost(sharePostInterface: SharePostInterface) {
    return this.http
      .post(
        `${this.API_URL}/permanent-posts/${sharePostInterface.post_id}/share`,
        {
          user_id: sharePostInterface.user_id
        },
        this.jwtService.getHttpOptions()
      );
  }

  onToggleCreate() {
    this.toggleCreate = !this.toggleCreate;
  }
}
