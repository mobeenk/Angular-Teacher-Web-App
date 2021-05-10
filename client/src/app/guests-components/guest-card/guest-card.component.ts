
import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-guest-card',
  templateUrl: './guest-card.component.html',
  styleUrls: ['./guest-card.component.css']
})
export class GuestCardComponent implements OnInit {

  @Input() member: Member;

  constructor(private memberService: MembersService, private toastr: ToastrService, 
    public presence: PresenceService) { }

  ngOnInit(): void {
    //  let map = new Map<string, string>();
    //   map.set("السعودية", "sa"); 
    //   if (member.country == 'السعودية'){
    //     member.countryEn = map.get('السعودية')
    //   }
    //   else{
    //      member.countryEn = map.get('السعودية')
    //   }
  }

  addLike(member: Member) {
    this.memberService.addLike(member.username).subscribe(() => {
      this.toastr.success('You have liked ' + member.knownAs);
    })
  }
}
