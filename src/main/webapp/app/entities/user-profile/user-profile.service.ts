import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SERVER_API_URL } from '../../app.constants';
import { UserProfile } from './user-profile.model';
import { createRequestOption } from '../../shared/model/request-util';

@Injectable()
export class UserProfileService {
    private resourceUrl = SERVER_API_URL + 'api/UserProfiles';

    constructor(private http: HttpClient) { }

    create(userProfile: UserProfile): Observable<HttpResponse<UserProfile>> {
        return this.http.post<UserProfile>(this.resourceUrl, userProfile, { observe: 'response' });
    }

    update(userProfile: UserProfile): Observable<HttpResponse<UserProfile>> {
        return this.http.put<UserProfile>(this.resourceUrl, userProfile, { observe: 'response' });
    }

    /**
    find(login: string): Observable<HttpResponse<UserProfile>> {
        return this.http.get<UserProfile>(`${this.resourceUrl}/${login}`, { observe: 'response' });
    }

    query(req?: any): Observable<HttpResponse<UserProfile[]>> {
        const options = createRequestOption(req);
        return this.http.get<UserProfile[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(login: string): Observable<HttpResponse<any>> {
        return this.http.delete(`${this.resourceUrl}/${login}`, { observe: 'response' });
    }

    authorities(): Observable<string[]> {
        return this.http.get<string[]>(SERVER_API_URL + 'api/UserProfiles/authorities');
    }
    */

}
