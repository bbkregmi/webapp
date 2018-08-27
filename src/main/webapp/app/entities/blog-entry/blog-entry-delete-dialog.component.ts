import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { BlogEntry } from './blog-entry.model';
import { BlogEntryPopupService } from './blog-entry-popup.service';
import { BlogEntryService } from './blog-entry.service';

@Component({
    selector: 'jhi-blog-entry-delete-dialog',
    templateUrl: './blog-entry-delete-dialog.component.html'
})
export class BlogEntryDeleteDialogComponent {

    blogEntry: BlogEntry;

    constructor(
        private blogEntryService: BlogEntryService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.blogEntryService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'blogEntryListModification',
                content: 'Deleted an blogEntry'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-blog-entry-delete-popup',
    template: ''
})
export class BlogEntryDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private blogEntryPopupService: BlogEntryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.blogEntryPopupService
                .open(BlogEntryDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
