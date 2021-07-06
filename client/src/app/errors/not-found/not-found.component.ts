// import {Component, Inject, OnInit, Optional, PLATFORM_ID} from '@angular/core';
// import {REQUEST} from "@nguniversal/express-engine/tokens";
// import {isPlatformServer} from "@angular/common";

import { Component, OnInit, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { isPlatformServer } from '@angular/common';
import { Request } from 'express';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Optional() @Inject(REQUEST) private request: Request
  ) { }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      if (this.request.res) {
        this.request.res.status(404);
      }
    }
  }

}
