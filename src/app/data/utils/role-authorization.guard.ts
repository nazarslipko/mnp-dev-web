import { CanActivateFn } from '@angular/router';
import { ProfileService } from './profile.service';
import { inject } from '@angular/core';

export const roleAuthorizationGuard: CanActivateFn = (route, state) => {
  const currentUser: ProfileService = inject(ProfileService);
  // read user info object setup but the session object. If user info is null/empty, user has no role to access object, if role=1, app user, role= 2, admin.
  let isValid = false;
  const profile = currentUser.getProfile();
  if (profile) {
    if (profile.RoleId == 1) isValid = true;
  }

  return isValid;
};
