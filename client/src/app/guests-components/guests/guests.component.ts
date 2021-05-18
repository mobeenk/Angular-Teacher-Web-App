
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
  pageSizeList = [{ value: 6, display: '6' }, { value: 12, display: '12' },{value: 18, display: '18'},{value: 24, display: '24'}];
  // countryList =  [
  //   { value: 'السعودية', display: 'السعودية' },
  //   { value: 'أمريكا', display: 'أمريكا' },
  //   { value: 'كندا', display: 'كندا' },
  //   { value: 'أمريكا الجنوبية', display: '' },
  //   { value: 'أوروبا', display: 'أوروبا' },
  //   { value: 'استراليا', display: 'استراليا' },
  //   { value: 'مصر', display: 'مصر' },
  //   { value: 'الكويت', display: 'الكويت' },
  //   { value: 'الإمارات', display: 'الإمارات' },
  //   { value: 'البحرين', display: 'البحرين' },
  //   { value: 'عمان', display: 'عمان' },
  //   { value: 'اليمن', display: 'اليمن' },
  //   { value: 'سوريا', display: 'سوريا' },
  //   { value: 'لبنان', display: 'لبنان' },
  //   { value: 'الأردن', display: 'الأردن' },
  //   { value: 'العراق', display: 'العراق' },
  //   { value: 'فلسطين', display: 'فلسطين' },
  //   { value: 'الجزائر', display: 'الجزائر' },
  //   { value: 'المغرب', display: 'المغرب' },
  //   { value: 'السودان', display: 'السودان' },
  //   { value: 'ليبيا', display: 'ليبيا'},
  //   { value: 'تونس', display: 'تونس'}
  // ];
  countryList: Array<any> = [
    { name: 'الكل', cities: ['الكل'] },
    { name: 'السعودية', cities: ['الدمام', 'الرياض', 'جدة', 'نجران'] },
    { name: 'أمريكا', cities: ['واشنطن', 'نيويورك', 'أخرى'] },
    { name: 'كندا', cities: ['تورونتو', 'أخرى'] },
    { name: 'أمريكا الجنوبية', cities: ['البرازيل', 'أخرى'] },
    { name: 'أوروبا', cities: ['السويد', 'ألمانيا', 'فرنسا', 'إسبانيا', 'أخرى'] },
    { name: 'استراليا', cities: ['سيدني', 'أخرى'] },
    { name: 'مصر', cities: ['القاهرة', 'أخرى'] },
    { name: 'الكويت', cities: ['الكويت', 'أخرى'] },
    { name: 'الإمارات', cities: ['الشارقة', 'دبي', 'أبو ظبي', 'أخرى'] },
    { name: 'البحرين', cities: ['المنامة', 'أخرى'] },
    { name: 'عمان', cities: ['مسقط', 'أخرى'] },
    { name: 'اليمن', cities: ['صنعاء', 'أخرى'] },
    { name: 'سوريا', cities: ['حلب', 'دمشق', 'حمص', 'حماة', 'دير الزور', 'أخرى'] },
    { name: 'لبنان', cities: ['طرابلس', 'بيروت', 'أخرى'] },
    { name: 'الأردن', cities: ['عمان', 'أخرى'] },
    { name: 'العراق', cities: ['بغداد', 'أخرى'] },
    { name: 'فلسطين', cities: ['القدس', 'أخرى'] },
    { name: 'الجزائر', cities: ['الجزائر', 'أخرى'] },
    { name: 'المغرب', cities: ['الدار البيضاء', 'أخرى'] },
    { name: 'السودان', cities: ['الخرطوم', 'أخرى'] },
    { name: 'ليبيا', cities: ['أخرى'] },
    { name: 'تونس', cities: ['أخرى', 'تونس']
  
  }
  ];
  cities: Array<any>;

  majors: Array<string> = ['فيزياء', 'كيمياء', 'رياضيات', 'برمجة', 'قرآن', 'فرنسي', 'إنجليزي', 'مدرس جامعي', 'دكتور جامعي',
    'هندسة ', 'طب', 'تمريض', 'باحث', 'تجارة واقتصاد','الكل']
    
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
    this.guestParams = this.memberService.resetGuestParams();
    this.loadMembers();
  }

  pageChanged(event: any) {
    this.guestParams.pageNumber = event.page;
    this.memberService.setUserParams(this.guestParams);
    this.loadMembers();
  }
  changeCountry(country) {
    // 
    this.cities = this.countryList.find(con => con.name == country).cities;
    this.guestParams.city = this.cities[0];
  }
}
