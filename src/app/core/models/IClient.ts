export interface IClient {
  ClientId?: number;
  ClientName?: string;
  ApiKey?: string;
  DataSecret?: string;
  EndpointUrl?: string;
  Requests: boolean;
  TheScroll: boolean;
  Meetings: boolean;
  Approved: boolean;
  CreatedUserId?: number;
  CreatedDate?: Date;
  ModifiedUserId?: number;
  ModifiedDate?: Date;
}
