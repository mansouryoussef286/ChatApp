import { Message } from "./message";
import { User } from "./user";

export class Chat {
    constructor(
        public id:string,
        public channelId:string,
        public name: string,
        public createdDate: string,
        public messages: Message[],
        public users: User[]
    ){}
}
