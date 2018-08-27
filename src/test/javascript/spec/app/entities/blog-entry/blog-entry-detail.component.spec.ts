/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { WebappTestModule } from '../../../test.module';
import { BlogEntryDetailComponent } from '../../../../../../main/webapp/app/entities/blog-entry/blog-entry-detail.component';
import { BlogEntryService } from '../../../../../../main/webapp/app/entities/blog-entry/blog-entry.service';
import { BlogEntry } from '../../../../../../main/webapp/app/entities/blog-entry/blog-entry.model';

describe('Component Tests', () => {

    describe('BlogEntry Management Detail Component', () => {
        let comp: BlogEntryDetailComponent;
        let fixture: ComponentFixture<BlogEntryDetailComponent>;
        let service: BlogEntryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [WebappTestModule],
                declarations: [BlogEntryDetailComponent],
                providers: [
                    BlogEntryService
                ]
            })
            .overrideTemplate(BlogEntryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(BlogEntryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BlogEntryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new BlogEntry(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.blogEntry).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
