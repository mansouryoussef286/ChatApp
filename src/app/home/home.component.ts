import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { faArrowRightFromBracket as icon } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as homeActions from '../_store/actions/home-actions';
import * as fromHome from '../_store/reducers/home-reducer';
import * as fromLogin from '../_store/reducers/login-reducer';
import { appState } from '../_store/state/app.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwPush } from '@angular/service-worker';
import { MessagesService } from '../_services/messages.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    logoutIcon = icon;
    users$: Observable<User[]> | undefined;
    myID: string | undefined;
    myuser$: Observable<User | null> | undefined;
    // myUser: User | undefined;

    selectedUser$: Observable<User | null> | undefined;

    errorMessage$: Observable<string | null> | undefined;
    isFetchingUsers$: Observable<boolean> | undefined;

    userSearchText: string = '';
    searchedUser: User | undefined;

    ConnectionLost: string = '';
    reconnected: string = '';

    private readonly VAPID_PUBLIC_KEY: string = 'BHWkHDDLixMa3SzAMhbw4rsQ-lUDQbR8bogy9yBXVuM2WWUWTLOIkmtyy09r5iV3bpYVnxxw3GGD1IGfBc4TE3I'
    constructor(
        private router: Router,
        private store: Store<appState>,
        private modalService: NgbModal,
        private messageService: MessagesService,
        private swPush: SwPush
    ) { }


    ngOnInit(): void {
        // get contacts list
        this.store.dispatch(homeActions.getUsers());
        // get my id from local storage
        this.myID = localStorage.getItem('currentUserID') || '';
        // get my user in the state in case that its a reload not sign in
        this.store.dispatch(homeActions.reloadConvList({ myID: this.myID }));

        // select the state 
        this.users$ = this.store.select(fromHome.users);
        this.myuser$ = this.store.select(fromLogin.user);

        this.selectedUser$ = this.store.select(fromHome.selectedUser);
        this.errorMessage$ = this.store.select(fromHome.errorMsg);
        this.isFetchingUsers$ = this.store.select(fromHome.isFetchingUsers);

        //#region  display connection lost
        addEventListener('offline', e => {
            this.ConnectionLost = 'No internet connection';
        });

        addEventListener('online', e => {
            this.ConnectionLost = '';
            this.reconnected = 'connected!';
            setTimeout(() => {
                this.reconnected = '';
                this.store.dispatch(homeActions.reloadConvList({ myID: this.myID || '' }));
                this.store.dispatch(homeActions.getUsers());
            }, 2000);
        })
        //#endregion

        //#region prompt for sending notifications
        this.swPush.requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC_KEY
        }).then(sub => {
            this.messageService.addPushSub(sub).subscribe({
                next: data => {
                    console.log("subscribed to push notification successfully");
                },
                error: err => console.log(err)
            });
        }).catch(console.log);
        //#endregion

        // listen on any notification messages
        this.swPush.messages.subscribe(message => console.log);

        // on notification click
        this.swPush.notificationClicks.subscribe(
            ({ action, notification }) => {
                // do whatever you want according to the action or the notification
                // but don't httpclient unless fetch() due to SW limitations
                // console.log(notification);
                // console.log(action);

            }
        )
    }

    getNotification() {
        this.messageService.getNotified().subscribe();
    }

    onContactClicked(user: User) {
        this.store.dispatch(homeActions.selectUser({ user }));
    }

    onChooseSearchUser(user: User) {
        this.searchedUser = user;
    }

    addConv() {
        // close the modal
        this.modalService.dismissAll();

        if (this.searchedUser)
            this.store.dispatch(homeActions.selectUser({ user: this.searchedUser }));
        this.router.navigate(['/home', 'room', this.searchedUser?.id]);
    }

    openAddContactModal(content: any) {
        this.userSearchText = '';
        this.searchedUser = undefined;
        this.modalService.open(content, { centered: true, size: 'lg' });
    }
}
