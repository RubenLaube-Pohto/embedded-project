import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './auth.guard';
import { ApiService } from './api.service';

// Bootstrap modules
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { MdProgressSpinnerModule } from '@angular/material';

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
    ButtonsModule.forRoot(),
    CarouselModule.forRoot(),
    BrowserAnimationsModule,
    MdProgressSpinnerModule
  ],
  providers: [
      AuthGuard,
      ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
