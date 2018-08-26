import { Routes } from '@angular/router';

import { UserHomeComponent } from './';

export const userProfileRoute: Routes = [
    {
        path: 'home/:login',
        component: UserHomeComponent,
        data: {
            authorities: [],
            pageTitle: 'Welcome'
        }
    }
];
