import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from 'app/auth.guard';
import { ApiService } from 'app/api.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    constructor(
        private auth: AuthGuard,
        private router: Router,
        private api: ApiService
    ) {}

    ngOnInit() {}

    logout() {
        this.auth.setToken(null);
        this.router.navigate(['/login']);
    }

    getData() {
        this.api.getData()
            .subscribe(
                res => console.log(res),
                err => console.log(err)
            );
    }

    getRaspis() {
        this.api.getRaspis()
            .subscribe(
                res => console.log(res),
                err => console.log(err)
            );
    }

}
