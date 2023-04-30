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
