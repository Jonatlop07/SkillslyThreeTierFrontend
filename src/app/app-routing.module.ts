import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth.routing';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { InputTextModule } from 'primeng/inputtext';
import { PagesRoutingModule } from './pages/pages.routing'

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NopagefoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
    AuthRoutingModule,
    PagesRoutingModule,
    InputTextModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
