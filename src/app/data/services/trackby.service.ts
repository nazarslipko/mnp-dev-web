import { Injectable } from "@angular/core";
import { IRole } from "../../core/models/IRole";

@Injectable()
export class TrackByService {
  role(index: number, role: IRole) {
    return role.RoleId;
  }
}
