/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { WebappTestModule } from '../../../test.module';
import { BlogEntryDialogComponent } from '../../../../../../main/webapp/app/entities/blog-entry/blog-entry-dialog.component';
import { BlogEntryService } from '../../../../../../main/webapp/app/entities/blog-entry/blog-entry.service';
import { BlogEntry } from '../../../../../../main/webapp/app/entities/blog-entry/blog-entry.model';
import { BlogService } from '../../../../../../main/webapp/app/entities/blog';

describe('Component Tests', () => {

    describe('BlogEntry Management Dialog Component', () => {
        let comp: BlogEntryDialogComponent;
        let fixture: ComponentFixture<BlogEntryDialogComponent>;
        let service: BlogEntryService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [WebappTestModule],
                declarations: [BlogEntryDialogComponent],
                providers: [
                    BlogService,
                    BlogEntryService
                ]
            })
            .overrideTemplate(BlogEntryDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(BlogEntryDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BlogEntryService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new BlogEntry(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.blogEntry = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'blogEntryListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new BlogEntry();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.blogEntry = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'blogEntryListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
