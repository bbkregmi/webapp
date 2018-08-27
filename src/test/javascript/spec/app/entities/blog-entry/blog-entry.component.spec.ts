/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { WebappTestModule } from '../../../test.module';
import { BlogEntryComponent } from '../../../../../../main/webapp/app/entities/blog-entry/blog-entry.component';
import { BlogEntryService } from '../../../../../../main/webapp/app/entities/blog-entry/blog-entry.service';
import { BlogEntry } from '../../../../../../main/webapp/app/entities/blog-entry/blog-entry.model';

describe('Component Tests', () => {

    describe('BlogEntry Management Component', () => {
        let comp: BlogEntryComponent;
        let fixture: ComponentFixture<BlogEntryComponent>;
        let service: BlogEntryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [WebappTestModule],
                declarations: [BlogEntryComponent],
                providers: [
                    BlogEntryService
                ]
            })
            .overrideTemplate(BlogEntryComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(BlogEntryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BlogEntryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new BlogEntry(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.blogEntries[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
