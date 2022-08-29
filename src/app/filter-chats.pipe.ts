import { Pipe, PipeTransform } from '@angular/core';
import { Chat } from './_models/chat';
import { User } from './_models/user';

@Pipe({
  name: 'filterChats',
  pure: false
})
export class FilterChatsPipe implements PipeTransform {

  transform(chats: Chat[] = [], myID:string = ''): User[] {
    let retUsersArray:User[] = [];
    if(chats){
        chats.forEach(chat=>{
            retUsersArray.push(chat.users.filter(user=>user.id!==myID)[0])
        })
    }
    return retUsersArray;
  }
}
