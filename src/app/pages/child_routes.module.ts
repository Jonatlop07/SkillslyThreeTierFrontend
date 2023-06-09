import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/components/profile/profile.component';
import { PostsCreateComponent } from './posts/posts-create/posts-create.component';
import { PostsQueryComponent } from './posts/posts-query/posts-query.component';
import { FollowRequestComponent } from './follow-request/follow-request.component';
import { PostUpdateComponent } from './posts/post-update/post_update.component';
import { FeedComponent } from './feed/feed.component';
import { ProjectsCreateComponent } from './projects/projects-create/projects-create.component';
import { EventCreateComponent } from './events/event-create/event-create.component';
import { MyEventsComponent } from './events/my-events/my-events.component';
import { UserGroupsComponent } from './groups/user-groups/user-groups.component';
import { GroupsQueryComponent } from './groups/groups-query/groups-query.component';
import { GroupComponent } from './groups/group/group.component';
import { GroupUpdateComponent } from './groups/group-update/group-update.component';
import { EventUpdateComponent } from './events/event-update/event-update.component';
import { ServiceOffersComponent } from './service-offers/service_offers.component'
import { ServiceRequestsComponent } from './service-requests/service_requests.component'
import { ProjectsQueryComponent } from "./projects/projects-query/projects-query.component";
import { ProjectsUpdateComponent } from "./projects/projects-update/projects-update.component";
import { routing_paths as user_account_routing_paths } from '../features/user-account/user_account.routing'
import { UserAccountView } from '../features/user-account/views/user_account.view'
import { routing_paths as chat_routing_paths } from '../features/chat/chat.routing'
import ChatView from '../features/chat/views/chat.view'

const routes: Routes = [
  { path: user_account_routing_paths.user_account, component: UserAccountView },
  { path: 'search/:searchInput', component: SearchComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'posts', component: PostsCreateComponent },
  { path: 'events', component: EventCreateComponent },
  { path: 'my-events', component: MyEventsComponent },
  { path: 'events/update/:event_id', component: EventUpdateComponent },
  { path: 'query/:user_id', component: PostsQueryComponent },
  { path: 'follow-requests', component: FollowRequestComponent },
  { path: 'post/update/:post_id', component: PostUpdateComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'projects', component: ProjectsCreateComponent },
  { path: 'projects-query/:user_id', component: ProjectsQueryComponent },
  { path: 'project/update/:project_id', component: ProjectsUpdateComponent },
  { path: chat_routing_paths.chat, component: ChatView },
  { path: 'follow-requests', component: FollowRequestComponent },
  { path: 'post/update/:post_id', component: PostUpdateComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'my-groups', component: UserGroupsComponent },
  { path: 'groups', component: GroupsQueryComponent },
  { path: 'group/:groupId', component: GroupComponent },
  { path: 'group/:groupId/admin', component: GroupUpdateComponent },
  { path: 'service-offers', component: ServiceOffersComponent },
  { path: 'service-requests', component: ServiceRequestsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {
}
