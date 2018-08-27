import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { Router } from '@angular/router';
import { Blog } from '../blog/blog.model';
import { Account, LoginModalService, Principal, LoginService } from '../../shared';
import { BlogService } from '../blog';

@Component({
    selector: 'jhi-user-home',
    templateUrl: './user-home.component.html'
})
export class UserHomeComponent implements OnInit {

    account: Account;
    blogs: Blog[];

    constructor(
        private principal: Principal,
        private eventManager: JhiEventManager,
        private blogService: BlogService,
        private jhiAlertService: JhiAlertService,
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });

        this.blogService.query()
            .subscribe((res: HttpResponse<Blog[]>) => { this.blogs = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
