import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { BlogEntry } from './blog-entry.model';
import { BlogEntryService } from './blog-entry.service';

@Injectable()
export class BlogEntryPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private blogEntryService: BlogEntryService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.blogEntryService.find(id)
                    .subscribe((blogEntryResponse: HttpResponse<BlogEntry>) => {
                        const blogEntry: BlogEntry = blogEntryResponse.body;
                        blogEntry.creationDate = this.datePipe
                            .transform(blogEntry.creationDate, 'yyyy-MM-ddTHH:mm:ss');
                        blogEntry.lastModified = this.datePipe
                            .transform(blogEntry.lastModified, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.blogEntryModalRef(component, blogEntry);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.blogEntryModalRef(component, new BlogEntry());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    blogEntryModalRef(component: Component, blogEntry: BlogEntry): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.blogEntry = blogEntry;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
