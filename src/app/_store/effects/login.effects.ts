import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, interval, merge, of, timer } from 'rxjs';
import { map, mergeMap, catchError, switchMap, tap, exhaustMap, concatMap, timeout } from 'rxjs/operators';
import { User } from 'src/app/_models/user';

import * as loginActions from '../actions/login-actions';

@Injectable()
export class LoginEffects {

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private store: Store
    ) { }

    login$ = createEffect(() => this.actions$.pipe(
        ofType(loginActions.Login),
        switchMap(loginObj => {
            return this.http.post<{token: string, user: User }>('http://localhost:3000/auth/signin', { email: loginObj.email, password: loginObj.password })
                .pipe(
                    map((respObj) => {
                        // console.log(respObj);
                        localStorage.setItem('token', respObj.token);
                        localStorage.setItem('currentUserID', respObj.user.id);
                        localStorage.setItem('currentUser', JSON.stringify(respObj.user));
                        this.router.navigate(['home', 'x']);
                        return loginActions.LoginSuccess({ user: new User(respObj.user.id, respObj.user.email, respObj.user.username, respObj.user.gender, respObj.user.chats), token: respObj.token });
                    }),
                    catchError(err => {
                        console.log(err);
                        return of(loginActions.LoginError({ errorMsg: err.error.message }));
                    })
                )
        })
    ));

    register$ = createEffect(() => this.actions$.pipe(
        ofType(loginActions.Register),
        switchMap(regObj => {
            return this.http.post<User>('http://localhost:3000/auth/signup',
                {
                    email: regObj.email,
                    password: regObj.password,
                    username: regObj.username,
                    gender: regObj.gender
                })
                .pipe(
                    map((regUser) => {
                        console.log(regUser);
                        this.store.dispatch(loginActions.RegisterSuccess());
                        return loginActions.Login({email: regUser.email, password: regObj.password})
                    }),
                    catchError(err => {
                        console.log(err);
                        
                        return of(loginActions.LoginError({ errorMsg: err.error.message }));
                    })
                )
        })
    ));
}