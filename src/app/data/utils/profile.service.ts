import { Injectable } from "@angular/core";
import { IContact } from "../../core/models/IHelpers";
@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  profile: any = {};
  constructor() { }

 getProfile(): IContact {
  
    const currentUser = sessionStorage?.getItem('CurrentUser');   
    if (currentUser) {
      this.profile = JSON.parse(currentUser) as IContact;   
    }
    
    return this.profile;
  }

}
