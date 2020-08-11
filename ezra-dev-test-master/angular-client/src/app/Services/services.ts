import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Member } from '../Model/member';
import { environment } from 'src/environments/environment'

// Makes http calls to the Api in order to perform operations like Add/Edit/Delete/Update
// by making appropriate http calls i.e, GET, PUT, POST, DELETE
// Works as an interface between the API calls, results and the angular component
@Injectable()
export class Services {

  private configUrl = environment.configUrl;
  
  constructor(private http: HttpClient) { }

  // Gets all the members from the Members database

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.configUrl)
      .pipe(
        catchError(e => throwError(e))
      );
  }

  // Makes call to the get member method with id to get data for edit

  getMembersById(id: string): Observable<Member> {
    const url = this.configUrl + id;
    return this.http.get<Member>(url)
      .pipe(
        catchError(e => throwError(e))
      );
  }

  // Makes post call to add new member into Member database

  addMember(member: Member): Observable<Member> {
    return this.http.post<Member>(this.configUrl, member)
      .pipe(
        catchError(e => throwError(e))
      );
  }


  // Makes call to the put method to update the member entry with the speicified id

  updateMember(member: Member): Observable<Member> {
    const url = this.configUrl + member.id;
    return this.http.put<Member>(url, member)
      .pipe(
        catchError(e => throwError(e))
      );
  }

   // Deletes the the members with sepcified id from Members database

  deleteMember(id: string): Observable<{}> {
    const url = this.configUrl + id; // DELETE api/members/id
    return this.http.delete(url).pipe(
      catchError(e => throwError(e))
    );
  }
}
