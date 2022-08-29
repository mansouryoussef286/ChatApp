import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/_models/user';

export const getUsers = createAction(
    '[Home page] get Users'
);

export const getUsersSuccess = createAction(
    '[Home page] get Users Success',
    props<{ users: User[] }>()
);

export const getUsersError = createAction(
    '[Home page] get Users Error',
    props<{ errorMsg: string }>()
);

export const selectUser = createAction(
    '[Home page] Select a user from conversations',
    props<{ user: User }>()
);

export const addConv = createAction(
    '[Home page] adding new conversation',
    props<{ user: User }>()
);

export const reloadConvList = createAction(
    '[Home page] reload the conversation list',
    props<{ myID: string }>()
);

export const reloadConvListSuccess = createAction(
    '[Home page] reload the conversation list Success'
);

export const reloadConvListError = createAction(
    '[Home page] reload the conversation list Error',
    props<{ error: string }>()
);


