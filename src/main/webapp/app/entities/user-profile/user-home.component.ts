import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { Router } from '@angular/router';
import { Account, LoginModalService, Principal, LoginService } from '../../shared';

@Component({
    selector: 'jhi-user-home',
    templateUrl: './user-home.component.html'
})
export class UserHomeComponent implements OnInit {

    account: Account;

    constructor(
        private principal: Principal,
        private eventManager: JhiEventManager,
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
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
}
