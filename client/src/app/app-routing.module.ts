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
import { VerificationsComponent } from './verifications/verifications.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import { OrdersComponent } from './orders/orders.component';
import { ChatComponent } from './chat/chat.component';
import { CartComponent } from './cart/cart.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  {
    path: 'departments',
    component: DepartmentsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'requisitions',
    component: RequisitionsComponent,
    canActivate: [authGuard],
  },
  { path: 'stocks', component: StocksComponent, canActivate: [authGuard] },
  {
    path: 'recommendations',
    component: RecommendationsComponent,
    canActivate: [authGuard],
  },
  { path: 'audits', component: AuditsComponent, canActivate: [authGuard] },
  {
    path: 'verifications',
    component: VerificationsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'purchase-history',
    component: PurchaseHistoryComponent,
    canActivate: [authGuard],
  },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
  { path: 'chat/:id', component: ChatComponent, canActivate: [authGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: '**', component: Error404Component, canActivate: [authGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      scrollOffset: [0, 64],
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
