import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { SigninComponent } from './component/signin/signin.component';
import { AdminGuardService } from './service/admin-guard.service';
import { NurseryGuardService } from './service/nursery-guard.service';

const routes: Routes = [
  {
    path: "admin",
    loadChildren: () => import("./module/admin-module/admin-module.module").then(m => m.AdminModuleModule),
    canActivate: [AdminGuardService]
  },
  {
    path: "nursery",
    loadChildren: () => import("./module/nursery-module/nursery-module.module").then(m => m.NurseryModuleModule),
    canActivate: [NurseryGuardService]
  },
  { path: '', component: SigninComponent },
  { path: "home", component: HomeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
