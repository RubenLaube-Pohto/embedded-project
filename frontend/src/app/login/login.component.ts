import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { AuthGuard } from 'app/auth.guard';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(
        private http: Http,
        private auth: AuthGuard,
        private router: Router
    ) {}

    ngOnInit() {}

    login(username, password) {
        let body = {
            username: username,
            password: password
        };
        this.http.post('http://localhost:3000/api/login', body)
            .map((res: Response) => res.json())
            .catch((error: Response | any) => {
                return Observable.throw('Login failed');
            })
            .subscribe(
                res => this.handleLogin(res),
                error => console.log(error)
            );
    }

    handleLogin(res) {
        let token = res.token;
        this.auth.setToken(token);
        this.router.navigateByUrl('/');
    }

}
