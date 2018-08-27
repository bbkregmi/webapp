import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { BlogEntryComponent } from './blog-entry.component';
import { BlogEntryDetailComponent } from './blog-entry-detail.component';
import { BlogEntryPopupComponent } from './blog-entry-dialog.component';
import { BlogEntryDeletePopupComponent } from './blog-entry-delete-dialog.component';

@Injectable()
export class BlogEntryResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const blogEntryRoute: Routes = [
    {
        path: 'blog-entry',
        component: BlogEntryComponent,
        resolve: {
            'pagingParams': BlogEntryResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BlogEntries'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'blog-entry/:id',
        component: BlogEntryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BlogEntries'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const blogEntryPopupRoute: Routes = [
    {
        path: 'blog-entry-new',
        component: BlogEntryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BlogEntries'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'blog-entry/:id/edit',
        component: BlogEntryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BlogEntries'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'blog-entry/:id/delete',
        component: BlogEntryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BlogEntries'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
