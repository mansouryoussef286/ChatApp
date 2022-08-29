import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { Message } from '../_models/message';
import { User } from '../_models/user';

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    private baseUrl: string = 'http://localhost:3000';
    constructor(private http: HttpClient) { }

    getChat(senderID: string, receiverID: string) {
        return this.http.get<{ users: User[], messages: Message[] }>(this.baseUrl + '/chat', {
            params: {
                senderID,
                receiverID
            }
        })
            .pipe(
                map(data => {
                    // console.log(data);
                    return data
                })
            );
    }

    addPushSub(sub: PushSubscription) {
        // console.log(sub);
        return this.http.post('http://localhost:3000/chat/subscribe', { subs: sub });
    }

    getNotified() {
        return this.http.get('http://localhost:3000/chat/subscribe');
    }
}
