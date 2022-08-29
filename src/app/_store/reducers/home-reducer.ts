import { createReducer, createSelector, on } from '@ngrx/store';
import { appState } from '../state/app.state';
import * as homeActions from '../actions/home-actions';

import { User } from 'src/app/_models/user';

export interface state {
    readonly isFetchingUsers: boolean;
    readonly errorMsg: string | null;
    readonly selectedUser: User | null;
    readonly users: User[];
    readonly selectedUserNewConv: User | null;

}
export const initialState: state = {
    isFetchingUsers: false,
    errorMsg: null,
    selectedUser: null,
    users: [],
    selectedUserNewConv: null
};

export const homeReducer = createReducer(
    initialState,
    on(homeActions.getUsers,
        (state, action) => {
            return {
                ...state,
                isFetchingUsers: true,
            }
        }
    ),
    on(homeActions.getUsersSuccess,
        (state, action) => {
            return {
                ...state,
                isFetchingUsers: false,
                errorMsg: null,
                users: action.users
            }
        }
    ),
    on(homeActions.getUsersError,
        (state, action) => {
            return {
                ...state,
                isFetchingUsers: false,
                errorMsg: action.errorMsg || "unexpected error!",
            }
        }
    ),
    on(homeActions.selectUser,
        (state, action) => {
            return {
                ...state,
                selectedUser: action.user
            }
        }
    ),
    on(homeActions.addConv,
        (state, action) => {
            return {
                ...state
            }
        }
    ),
    on(homeActions.reloadConvList,
        (state, action) => {
            return {
                ...state,
                isFetchingUsers: true
            }
        }
    ),
    on(homeActions.reloadConvListSuccess,
        (state, action) => {
            return {
                ...state,
                isFetchingUsers: false,
            }
        }
    ),
    on(homeActions.reloadConvListError,
        (state, action) => {
            return {
                ...state,
                isFetchingUsers: false
            }
        }
    ),
);


//#region  selectors
export const selectFeature = (state: appState) => {
    return state.homeManager;
}

export const isFetchingUsers = createSelector(
    selectFeature,
    (state: state) => {
        return state.isFetchingUsers;
    }
)

export const errorMsg = createSelector(
    selectFeature,
    (state: state) => {
        return state.errorMsg;
    }
)

export const selectedUser = createSelector(
    selectFeature,
    (state: state) => {
        return state.selectedUser;
    }
)


export const users = createSelector(
    selectFeature,
    (state: state) => {
        return state.users;
    }
)
//#endregion