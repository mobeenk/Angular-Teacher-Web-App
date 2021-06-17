import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { PresenceService } from './_services/presence.service';
import { StorageService } from './_services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Dating app';
  users: any;
 
  constructor(private accountService: AccountService, private presence: PresenceService,private cookie: StorageService ) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    // const user: User = JSON.parse(localStorage.getItem('user'));
    const user: User = JSON.parse(  this.cookie.getItem('user')    );
    if (user) {
      this.accountService.setCurrentUser(user);
      this.presence.createHubConnection(user);
    }

  }

  

}
