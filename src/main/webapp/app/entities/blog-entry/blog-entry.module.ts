import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WebappSharedModule } from '../../shared';
import {
    BlogEntryService,
    BlogEntryPopupService,
    BlogEntryComponent,
    BlogEntryDetailComponent,
    BlogEntryDialogComponent,
    BlogEntryPopupComponent,
    BlogEntryDeletePopupComponent,
    BlogEntryDeleteDialogComponent,
    blogEntryRoute,
    blogEntryPopupRoute,
    BlogEntryResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...blogEntryRoute,
    ...blogEntryPopupRoute,
];

@NgModule({
    imports: [
        WebappSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        BlogEntryComponent,
        BlogEntryDetailComponent,
        BlogEntryDialogComponent,
        BlogEntryDeleteDialogComponent,
        BlogEntryPopupComponent,
        BlogEntryDeletePopupComponent,
    ],
    entryComponents: [
        BlogEntryComponent,
        BlogEntryDialogComponent,
        BlogEntryPopupComponent,
        BlogEntryDeleteDialogComponent,
        BlogEntryDeletePopupComponent,
    ],
    providers: [
        BlogEntryService,
        BlogEntryPopupService,
        BlogEntryResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebappBlogEntryModule {}
