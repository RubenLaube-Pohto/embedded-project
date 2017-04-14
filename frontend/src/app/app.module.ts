import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './auth.guard';
import { ApiService } from './api.service';

// Bootstrap modules
import { ButtonsModule } from 'ngx-bootstrap/buttons';

export const ROUTES: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [ AuthGuard ]
    },
    {
        path: 'login',
        component: LoginComponent
    }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    ButtonsModule.forRoot()
  ],
  providers: [
      AuthGuard,
      ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
