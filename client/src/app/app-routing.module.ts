import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Error404Component } from './error404/error404.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { DepartmentsComponent } from './departments/departments.component';
import { RequisitionsComponent } from './requisitions/requisitions.component';
import { StocksComponent } from './stocks/stocks.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { AuditsComponent } from './audits/audits.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'departments', component: DepartmentsComponent },
  { path: 'requisitions', component: RequisitionsComponent },
  { path: 'stocks', component: StocksComponent },
  { path: 'recommendations', component: RecommendationsComponent },
  { path: 'audits', component: AuditsComponent },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
