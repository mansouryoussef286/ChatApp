import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/_models/user';

// login actions
export const Login = createAction(
    '[Login page] login',
    props<{ email: string, password: string }>()
);
export const LoginSuccess = createAction(
    '[Login page] login success',
    props<{ user: User, token: string }>()
);
export const LoginError = createAction(
    '[Login page] login error',
    props<{ errorMsg: string }>()
);

// register actions
export const Register = createAction(
    '[Login page] register',
    props<{ email: string, username: string, gender: string, password: string }>()
);
export const RegisterSuccess = createAction(
    '[Login page] register Success'
);
export const RegisterError = createAction(
    '[Login page] register Error',
    props<{ errorMsg: string }>()
);