import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreatePostDataPresenter } from '../interfaces/presenter/post/create_post_data.presenter';
import { toPost } from '../interfaces/presenter/post/post_form_data.presenter';
import { JwtService } from './jwt.service';

@Injectable({ providedIn: 'root' })
export class PostService {
    private readonly API_URL: string = environment.API_URL;
  toggleCreate = false;
  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService
  ) {}

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

  onToggleCreate() {
    this.toggleCreate = !this.toggleCreate;
  }
}
