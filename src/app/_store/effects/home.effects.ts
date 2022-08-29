import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, interval, merge, of, timer } from 'rxjs';
import { map, mergeMap, catchError, switchMap, tap, exhaustMap, concatMap, timeout } from 'rxjs/operators';
import { User } from 'src/app/_models/user';

import * as homeActions from '../actions/home-actions';
import * as loginActions from '../actions/login-actions';

@Injectable()
export class HomeEffects {

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private store: Store
    ) { }

    getUsers$ = createEffect(() => this.actions$.pipe(
        ofType(homeActions.getUsers),
        switchMap(() => {
            return this.http.get<User[]>('http://localhost:3000/users')
                .pipe(
                    map(data => {
                        // console.log(data);
                        return homeActions.getUsersSuccess({ users: data });
                    }),
                    catchError(err => {
                        return of(homeActions.getUsersError({ errorMsg: err.error.message }));
                    })
                )
        })
    ));

    GetMyUser$ = createEffect(() => this.actions$.pipe(
        ofType(homeActions.reloadConvList),
        switchMap((myID) => {
            return this.http.get<User>('http://localhost:3000' + `/chat/userchats/${myID.myID}`)
                .pipe(
                    map(data => {
                        // console.log(data);
                        let user = data;
                        this.store.dispatch(homeActions.reloadConvListSuccess());
                        return loginActions.LoginSuccess({ user: new User(user.id, user.email, user.username, user.gender, user.chats), token: "app is reloaded unfortunately" });
                    }),
                    catchError(err => {
                        console.log(err);
                        return of(homeActions.reloadConvListError(err.message));
                    })
                );
        })
    ));
}