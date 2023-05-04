import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { Error403Component } from './error403/error403.component';
import { Error404Component } from './error404/error404.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { MainSidebarComponent } from './components/main-sidebar/main-sidebar.component';
import { UsersComponent } from './users/users.component';
import { RequisitionsComponent } from './requisitions/requisitions.component';
import { DepartmentsComponent } from './departments/departments.component';
import { TruncateNumberPipe } from './pipes/truncate-digit.pipe';
import { RolePipe } from './pipes/role.pipe';
import { UserFormComponent } from './user-form/user-form.component';
import { MessageBoxComponent } from './components/message-box/message-box.component';
import { DepartmentFormComponent } from './department-form/department-form.component';
import { StocksComponent } from './stocks/stocks.component';
import { StockFormComponent } from './stock-form/stock-form.component';
import { RequisitionFormComponent } from './requisition-form/requisition-form.component';
import { RequisitionDetailComponent } from './requisition-detail/requisition-detail.component';
import { RequisitionItemFormComponent } from './requisition-item-form/requisition-item-form.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { RequisitionListComponent } from './components/requisition-list/requisition-list.component';
import { RecommendationListComponent } from './components/recommendation-list/recommendation-list.component';
import { CommentsComponent } from './components/comments/comments.component';
import { CommentComponent } from './components/comment/comment.component';
import { AuditsComponent } from './audits/audits.component';
import { AuditListComponent } from './components/audit-list/audit-list.component';
import { VerificationListComponent } from './components/verification-list/verification-list.component';
import { VerificationsComponent } from './verifications/verifications.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import { PurchaseFormComponent } from './purchase-form/purchase-form.component';
import { RequisitionItemsComponent } from './requisition-items/requisition-items.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ChatComponent } from './chat/chat.component';
import { MessagesComponent } from './messages/messages.component';
import { ChatSearchUsersComponent } from './chat-search-users/chat-search-users.component';
import { ReceiptImageComponent } from './receipt-image/receipt-image.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    Error403Component,
    Error404Component,
    DashboardComponent,
    MainNavbarComponent,
    MainSidebarComponent,
    UsersComponent,
    RequisitionsComponent,
    DepartmentsComponent,
    TruncateNumberPipe,
    RolePipe,
    UserFormComponent,
    MessageBoxComponent,
    DepartmentFormComponent,
    StocksComponent,
    StockFormComponent,
    RequisitionFormComponent,
    RequisitionDetailComponent,
    RequisitionItemFormComponent,
    RecommendationsComponent,
    RequisitionListComponent,
    RecommendationListComponent,
    CommentsComponent,
    CommentComponent,
    AuditsComponent,
    AuditListComponent,
    VerificationListComponent,
    VerificationsComponent,
    PurchaseHistoryComponent,
    PurchaseFormComponent,
    RequisitionItemsComponent,
    OrdersComponent,
    OrderListComponent,
    OrderDetailsComponent,
    ChatComponent,
    MessagesComponent,
    ChatSearchUsersComponent,
    ReceiptImageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    FontAwesomeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
