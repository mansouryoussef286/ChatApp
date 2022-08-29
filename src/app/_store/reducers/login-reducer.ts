import { createReducer, createSelector, on } from '@ngrx/store';
import { appState } from '../state/app.state';
import * as loginActions from '../actions/login-actions';
import { User } from 'src/app/_models/user';

export interface state {
    readonly isFetching: boolean;
    readonly errorMsg: string | null;
    readonly user: User | null;
    readonly token: string | null;
}
export const initialState: state = {
    isFetching: false,
    errorMsg: null,
    user: null,
    token: null
};

export const loginReducer = createReducer(
    initialState,
    on(loginActions.Login,
        (state, action) => {
            return {
                ...state,
                isFetching: true,
                errorMsg: null,
            }
        }
    ),
    on(loginActions.LoginSuccess,
        (state, action) => {
            return {
                ...state,
                isFetching: false,
                errorMsg: null,
                user: action.user,
                token: action.token
            }
        }
    ),
    on(loginActions.LoginError,
        (state, action) => {
            return {
                ...state,
                isFetching: false,
                errorMsg: action.errorMsg || "unexpected error!",
                user: null,
                token: null
            }
        }
    ),
    on(loginActions.Register,
        (state, action) => {
            return {
                ...state,
                isFetching: true,
                errorMsg: null
            }
        }
    ),
    on(loginActions.RegisterSuccess,
        (state, action) => {
            return {
                ...state,
                isFetching: false,
                errorMsg: null
            }
        }
    ),
    on(loginActions.RegisterError,
        (state, action) => {
            return {
                ...state,
                isFetching: false,
                errorMsg: action.errorMsg
            }
        }
    ),
);


//#region  selectors
export const selectFeature = (state: appState) => {
    return state.loginManager
}

export const isFetching = createSelector(
    selectFeature,
    (state: state) => {
        return state.isFetching;
    }
)

export const errorMsg = createSelector(
    selectFeature,
    (state: state) => {
        return state.errorMsg;
    }
)

export const user = createSelector(
    selectFeature,
    (state: state) => {
        return state.user;
    }
)

export const token = createSelector(
    selectFeature,
    (state: state) => {
        return state.token;
    }
)
