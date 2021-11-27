import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountComponent } from './account/account.component'
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/components/profile/profile.component';
import { PostsCreateComponent } from './user/posts/posts-create/posts-create.component';
import { ChatComponent } from './chat/chat.component'

const routes: Routes = [
  { path: 'account', component: AccountComponent },
  { path: 'search/:searchInput' , component: SearchComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'posts', component: PostsCreateComponent},
  { path: 'chat', component: ChatComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildRoutesModule {}
