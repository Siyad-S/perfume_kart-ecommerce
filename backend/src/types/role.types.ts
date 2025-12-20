export interface RoleType {
  name: string;
  permissions: [string];
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}