import { Session } from "./Session";
import { User } from "./User";

export class Project {

  id: number;
  name: string;
  totalTime: number;
  totalSessions: number;
  sessions: Session[] = [];
  projectUser: User;
  hideSession: boolean = true;

  constructor() {

  }
}
