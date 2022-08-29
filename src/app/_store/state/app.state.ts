import * as fromLogin from "../reducers/login-reducer";
import * as fromHome from "../reducers/home-reducer";
import {ActionReducerMap} from '@ngrx/store';

export interface appState{
    loginManager: fromLogin.state
    homeManager: fromHome.state
}

export const appReducer: ActionReducerMap<appState>={
    loginManager: fromLogin.loginReducer,
    homeManager: fromHome.homeReducer
}