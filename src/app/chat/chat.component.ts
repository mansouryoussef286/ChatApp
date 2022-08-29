import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'socket.io-client';
import { MessagesService } from '../_services/messages.service';
import { SocketService } from '../_services/socket.service';
import { Message } from '../_models/message';
import { User } from '../_models/user';
import { Store } from '@ngrx/store';
import { appState } from '../_store/state/app.state';

import * as fromHome from '../_store/reducers/home-reducer';
import * as homeActions from '../_store/actions/home-actions';

// import { Socket } from 'ngx-socket-io';
// import { WebSocket } from 'ws';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {

    messages: Message[] = [];
    socket: Socket | undefined;
    myID: string = '';
    roomID: string = '';

    otherUser: User = new User("", "", "", "", []);
    token: string = '';
    // for auto scroll down
    @ViewChildren('messagesdiv') messagesdiv: QueryList<any> | undefined;
    @ViewChild('messagesBox') messagesBox: ElementRef | undefined;

    constructor(
        private socketService: SocketService,
        private messagesService: MessagesService,
        private route: ActivatedRoute,
        private store: Store<appState>
    ) { }

    ngOnInit(): void {
        this.store.select(fromHome.selectedUser).subscribe(selectedUser => {
            if (selectedUser)
                this.otherUser = selectedUser
        });
        this.route.params.subscribe(params => {

            this.messages = [];
            // get local storage info
            this.myID = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
            this.token = localStorage.getItem('token') || '';

            if (!this.otherUser.id)
                this.otherUser.id = params['id']

            // disconnect the socket in case a chat was opened before
            this.socketService.disconnectSocket();

            this.socketService.connectWith(this.myID, this.otherUser.id, this.token);
            // console.log('connected to socket with ids ', this.myID, this.otherUser.id);

            // get the messges from db
            this.messagesService.getChat(this.myID, this.otherUser.id).subscribe(data => {
                this.messages = data?.messages || [];
                if (data?.users)
                    this.otherUser = data.users.find(user => user.id != this.myID) || new User("", "", "", "", []);
            }, err => console.log(err)
            )

            this.socket = this.socketService.getSocket();

            this.socket?.on('joined the chat', data => {
                this.roomID = data.roomID
                console.log(this.roomID);
                
                // recall my user to get the update version with the newly added conv
                this.store.dispatch(homeActions.reloadConvList({ myID: this.myID || '' }));
            });

            this.socket?.on('serverChatMessage', (message: Message) => {
                console.log(message);
                this.messages.push(message);
            });
        });
    }

    ngAfterViewInit() {
        this.scrollToBottom();
        this.messagesdiv?.changes.subscribe(this.scrollToBottom);
    }

    scrollToBottom = () => {
        try {
            if (this.messagesBox)
                this.messagesBox.nativeElement.scrollTop = this.messagesBox?.nativeElement.scrollHeight;
        } catch (err) { }
    }

    onSubmit(f: NgForm) {
        this.socketService.emitMessage(f.value.message, this.myID, this.roomID);
        f.reset();
    }

    backgroundSync(){
        if('service')
        navigator.serviceWorker.ready.then(sw=>{
            // sw.sync.register('send-msg')
        })
    }

    ngOnDestroy(): void {
        // console.log("close");
        this.socketService.disconnectSocket();
    }
}
