import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { BlogEntry } from './blog-entry.model';
import { BlogEntryService } from './blog-entry.service';

@Component({
    selector: 'jhi-blog-entry-detail',
    templateUrl: './blog-entry-detail.component.html'
})
export class BlogEntryDetailComponent implements OnInit, OnDestroy {

    blogEntry: BlogEntry;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private blogEntryService: BlogEntryService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInBlogEntries();
    }

    load(id) {
        this.blogEntryService.find(id)
            .subscribe((blogEntryResponse: HttpResponse<BlogEntry>) => {
                this.blogEntry = blogEntryResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInBlogEntries() {
        this.eventSubscriber = this.eventManager.subscribe(
            'blogEntryListModification',
            (response) => this.load(this.blogEntry.id)
        );
    }
}
