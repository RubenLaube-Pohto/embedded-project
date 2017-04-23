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

    raspis: any[];
    documents: any[];
    imageCache: any;

    state = {
        loading: false,
        error: false
    };

    constructor(
        private auth: AuthGuard,
        private router: Router,
        private api: ApiService
    ) {}

    ngOnInit() {
        this.api.getRaspis()
            .subscribe(
                res => {
                    this.raspis = res.results;
                    console.log(this.raspis);
                },
                err => console.log(err)
            );
    }

    logout(): void {
        this.auth.setToken(null);
        this.router.navigate(['/login']);
    }

    getDocuments(raspiId: string) {
        this.api.getDocuments()
            .subscribe(
                res => {
                    this.documents = res.rows;
                    console.log(this.documents);
                    this.imageCache = {};
                    this.documents.forEach(doc => {
                        this.imageCache[doc.id] = null;
                    });
                    this.loadImage(this.documents[0].id);
                },
                err => console.log(err)
            );
    }

    loadImage(id: string): void {
        this.state.loading = true;
        this.state.error = false;

        if (this.imageCache[id]) {
            this.state.loading = false;
            return;
        }

        this.api.getImage(id)
            .finally(() => this.state.loading = false)
            .subscribe(
                res => {
                    this.imageCache[id] =
                        'data:image/JPEG;base64,' + this.arrayBufferToBase64(res);
                },
                err => {
                    console.log(err)
                    this.state.error = err;
                }
            );
    }

    arrayBufferToBase64(buffer: number[]): any {
        let binary = new Uint8Array(buffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '');

        return btoa(binary);
    }

    slideChanged(event: number) {
        this.loadImage(this.documents[event].id);
    }
}
