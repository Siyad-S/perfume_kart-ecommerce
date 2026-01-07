import { UserType } from './user.types';

declare global {
    namespace Express {
        interface User extends Partial<UserType> {
            _id: string | import("mongoose").Types.ObjectId;
            role: string;
        }
    }
}
