export interface OwnerCheckService {
    isOwner(userId: string, resourceId: string): Promise<boolean>;
  }