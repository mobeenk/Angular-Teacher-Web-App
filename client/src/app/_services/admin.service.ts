import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Photo } from '../_models/photo';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // getUsersWithRoles() {
  //   return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/users-with-roles');
  // }
 
  getUsersWithRoles(pageNumber, pageSize,searchUser?) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    if(searchUser)
      params = params.append('username', searchUser);
    return getPaginatedResult<User[]>(this.baseUrl + 'admin/users-with-roles', params, this.http);
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.http.post(this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles, {});
  }
  banUser(username: string){
    return this.http.post(this.baseUrl+'admin/ban-user/'+ username,{} ,{observe: 'response'} );
  }
  unBanUser(username: string){
    return this.http.post(this.baseUrl+'admin/unban-user/'+ username,{} ,{observe: 'response'} );
  }
// photos approval
  getPhotosForApproval(){
    return this.http.get<Photo[]>(this.baseUrl+'admin/photos-to-moderate');
  }
  approvePhoto(photoId: number){
    return this.http.post(this.baseUrl+'admin/approve-photo/'+ photoId,{});
  }
  rejectPhoto(photoId: number){
    return this.http.post(this.baseUrl+'admin/reject-photo/'+ photoId,{});
  }

}
