import { Chat } from "./chat";

export class User {
    constructor(
        public id:string,
        public email:string,
        public username:string,
        public gender: string,
        public chats: Chat[]
    ){}
}
