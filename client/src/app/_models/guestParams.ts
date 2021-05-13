import { User } from './user';

export class GuestParams {
    gender: string;
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 5;
    orderBy = 'lastActive';

    constructor() {
        this.gender =  'الكل';
    }
    
}