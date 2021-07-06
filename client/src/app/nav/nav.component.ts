import {Component, Inject, OnInit, Optional, PLATFORM_ID} from '@angular/core';
import {AccountService} from '../_services/account.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {REQUEST} from '@nguniversal/express-engine/tokens';
import {Request} from 'express';
import {isPlatformServer} from "@angular/common";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Optional() @Inject(REQUEST) private request: Request,
    public accountService: AccountService, private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/members').then();
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/').then();
  }
}
