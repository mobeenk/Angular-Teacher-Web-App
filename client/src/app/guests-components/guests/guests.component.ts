
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';

import { Component, OnInit } from '@angular/core';
import { GuestParams } from '../../_models/guestParams';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.css']
})
export class GuestsComponent implements OnInit {

  members: Member[];
  pagination: Pagination;
  guestParams: GuestParams;
  user: User;
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' },{value: 'الكل', display: 'الكل'}];
  // control page size menu
  pageSizeList = [{ value: 5, display: '5' }, { value: 10, display: '10' },{value: 15, display: '15'}];

  constructor(private memberService: MembersService) {
    // this.userParams = this.memberService.getUserParams();
    this.guestParams = new GuestParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.setUserParams(this.guestParams);
    this.memberService.getGuests(this.guestParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  resetFilters() {
    this.guestParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any) {
    this.guestParams.pageNumber = event.page;
    this.memberService.setUserParams(this.guestParams);
    this.loadMembers();
  }
}
