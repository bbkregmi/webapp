import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WebappSharedModule, User } from '../../shared';

import {
    UserProfileService,
    UserHomeComponent,
    userProfileRoute
} from './';

const ENTITY_STATES = [
    ...userProfileRoute
];

@NgModule({
    imports: [
        WebappSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true }),
    ],
    declarations: [
        UserHomeComponent
    ],
    entryComponents: [
        UserHomeComponent
    ],
    providers: [
        UserProfileService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebappUserHomeModule {}
