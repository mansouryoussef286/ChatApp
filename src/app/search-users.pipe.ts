import { Pipe, PipeTransform } from '@angular/core';
import { User } from './_models/user';

@Pipe({
  name: 'searchUsers'
})
export class SearchUsersPipe implements PipeTransform {

    transform(value: User[] | null, searchtext: string|undefined): User[]|null {
        if(value && searchtext)
        return value.filter(user=>(user.username.includes(searchtext) || user.email.includes(searchtext)));
        else
        return value;
      }

}
