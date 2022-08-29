import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, Subscription, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { appState } from '../_store/state/app.state';
import * as fromLogin from '../_store/reducers/login-reducer';
import * as loginActions from '../_store/actions/login-actions';



@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    isFetching$: Observable<boolean> | undefined;
    errorMessage$: Subscription | undefined;

    constructor(
        private http: HttpClient,
        private router: Router,
        private modalService: NgbModal,
        private store: Store<appState>
    ) { }

    ngOnInit(): void {
        this.isFetching$ = this.store.select(fromLogin.isFetching);
        this.errorMessage$ = this.store.select(fromLogin.errorMsg).subscribe(
            errorMsg => {
                // fire the sweet alert
                if (errorMsg){
                    Swal.fire({
                        title: errorMsg,
                        text: 'Do you want to continue',
                        icon: 'error',
                        confirmButtonText: 'Dismiss'
                    })
                }
            }
        );
    }

    onLogin(f: NgForm) {
        this.store.dispatch(loginActions.Login({ email: f.value.email, password: f.value.password }));
    }

    onRegister(rf: NgForm) {
        // close the modal
        this.modalService.dismissAll();
        this.store.dispatch(loginActions.Register({ email: rf.value.email, username: rf.value.username,  password: rf.value.passwordData.password, gender: rf.value.gender }));
    }

    openVerticallyCentered(content: any) {
        this.modalService.open(content, { centered: true, size: 'lg' });
    }
}
