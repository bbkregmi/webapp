import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { BlogEntry } from './blog-entry.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<BlogEntry>;

@Injectable()
export class BlogEntryService {

    private resourceUrl =  SERVER_API_URL + 'api/blog-entries';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/blog-entries';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(blogEntry: BlogEntry): Observable<EntityResponseType> {
        const copy = this.convert(blogEntry);
        return this.http.post<BlogEntry>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(blogEntry: BlogEntry): Observable<EntityResponseType> {
        const copy = this.convert(blogEntry);
        return this.http.put<BlogEntry>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<BlogEntry>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<BlogEntry[]>> {
        const options = createRequestOption(req);
        return this.http.get<BlogEntry[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<BlogEntry[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<BlogEntry[]>> {
        const options = createRequestOption(req);
        return this.http.get<BlogEntry[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<BlogEntry[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: BlogEntry = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<BlogEntry[]>): HttpResponse<BlogEntry[]> {
        const jsonResponse: BlogEntry[] = res.body;
        const body: BlogEntry[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to BlogEntry.
     */
    private convertItemFromServer(blogEntry: BlogEntry): BlogEntry {
        const copy: BlogEntry = Object.assign({}, blogEntry);
        copy.creationDate = this.dateUtils
            .convertDateTimeFromServer(blogEntry.creationDate);
        copy.lastModified = this.dateUtils
            .convertDateTimeFromServer(blogEntry.lastModified);
        return copy;
    }

    /**
     * Convert a BlogEntry to a JSON which can be sent to the server.
     */
    private convert(blogEntry: BlogEntry): BlogEntry {
        const copy: BlogEntry = Object.assign({}, blogEntry);

        copy.creationDate = this.dateUtils.toDate(blogEntry.creationDate);

        copy.lastModified = this.dateUtils.toDate(blogEntry.lastModified);
        return copy;
    }
}
