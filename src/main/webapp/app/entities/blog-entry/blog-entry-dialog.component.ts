import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { BlogEntry } from './blog-entry.model';
import { BlogEntryPopupService } from './blog-entry-popup.service';
import { BlogEntryService } from './blog-entry.service';
import { Blog, BlogService } from '../blog';

@Component({
    selector: 'jhi-blog-entry-dialog',
    templateUrl: './blog-entry-dialog.component.html'
})
export class BlogEntryDialogComponent implements OnInit {

    blogEntry: BlogEntry;
    isSaving: boolean;

    blogs: Blog[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private blogEntryService: BlogEntryService,
        private blogService: BlogService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.blogService.query()
            .subscribe((res: HttpResponse<Blog[]>) => { this.blogs = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.blogEntry.id !== undefined) {
            this.subscribeToSaveResponse(
                this.blogEntryService.update(this.blogEntry));
        } else {
            this.subscribeToSaveResponse(
                this.blogEntryService.create(this.blogEntry));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<BlogEntry>>) {
        result.subscribe((res: HttpResponse<BlogEntry>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: BlogEntry) {
        this.eventManager.broadcast({ name: 'blogEntryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackBlogById(index: number, item: Blog) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-blog-entry-popup',
    template: ''
})
export class BlogEntryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private blogEntryPopupService: BlogEntryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.blogEntryPopupService
                    .open(BlogEntryDialogComponent as Component, params['id']);
            } else {
                this.blogEntryPopupService
                    .open(BlogEntryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
