import { Pipe, PipeTransform } from '@angular/core';
import { User } from './_models/user';

@Pipe({
  name: 'filterUsers',
  pure: false
})
export class FilterUsersPipe implements PipeTransform {

  transform(value: User[] | null, myUserID: string|undefined): User[]|null {
    if(value && myUserID)
    return value.filter(user=>(user.id !== myUserID));
    else
    return null;
  }

}
