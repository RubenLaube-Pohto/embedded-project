import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from 'app/auth.guard';
import { ApiService } from 'app/api.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(
        private auth: AuthGuard,
        private router: Router,
        private api: ApiService
    ) {}

    ngOnInit() {
        this.api.isAuthenticated()
            .subscribe(res => {
                // Got response so is authenticated
                this.router.navigate(['/']);
            })
    }

    login(username: string, password: string) {
        this.api.login(username, password)
            .subscribe(
                res => {
                    let token = res.token;
                    this.auth.setToken(token);
                    this.router.navigate(['/']);
                },
                error => console.log(error)
            );
    }

}
