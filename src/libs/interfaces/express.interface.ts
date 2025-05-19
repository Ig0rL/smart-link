import { Request } from 'express';

import { IUser } from '@/libs/interfaces/user.interface';

export interface IRequest extends Request {
	user?: IUser;
}
