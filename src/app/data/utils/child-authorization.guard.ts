import { CanActivateChildFn } from '@angular/router';
import { ProfileService } from './profile.service';
import { inject } from '@angular/core';

export const childAuthorizationGuard: CanActivateChildFn = (childRoute, state) => {
  // read user info object setup but the session object. Check if user is a moderator or intercedor/worrior.
  const currentUser: ProfileService = inject(ProfileService);
  const profile = currentUser.getProfile();
  if (profile.Intercessor) {
 
  }
  return true;
};
