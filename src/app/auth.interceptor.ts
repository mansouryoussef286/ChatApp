import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request.clone({
            setHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }));
    }
}


//     token: string | null = null;

//     constructor(private store:Store<appState>) { 
//         this.store.select(fromLogin.token).subscribe(token=>{
//             this.token = token;
//         });
//     }

//     intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//         return next.handle(request.clone({
//             setHeaders: { Authorization: `Bearer ${this.token}` }
//         }));
//     }
// }
