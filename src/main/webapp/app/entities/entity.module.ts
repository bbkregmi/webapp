import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebappUserHomeModule } from './user-profile/user-profile.module';
import { WebappBlogModule } from './blog/blog.module';

import { WebappBlogEntryModule } from './blog-entry/blog-entry.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        WebappBlogEntryModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
        WebappUserHomeModule,
        WebappBlogModule
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebappEntityModule {}
