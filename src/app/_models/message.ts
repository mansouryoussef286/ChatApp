import { User } from "./user";

export class Message {
    constructor(
        public _id: string,
        public channelId: string,
        public user: User,
        public text: string,
        public sentDate: Date
    ) { }
}