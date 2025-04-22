import { CanActivateFn } from '@angular/router';
import { IContact } from '../../core/models/IHelpers';
import { ProfileService } from './profile.service';
import { inject } from '@angular/core';

export const authorizationGuard: CanActivateFn = (route, state) => {
  
  const currentUser: ProfileService =  inject(ProfileService);
 let isValid = false;
  const contact = currentUser.getProfile();  
  if (contact) {
    if (contact.Active)isValid = true;
  }
  return isValid;
};
