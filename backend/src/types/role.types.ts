export interface RoleType {
  name: string;
  permissions: [string];
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}