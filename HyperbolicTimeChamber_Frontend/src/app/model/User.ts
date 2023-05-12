import { Project } from "./Project";
import { Session } from "./Session";

export class User {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  authorities: string[];
  isLocked: boolean;

  projects: Project[];
  sessions: Session[];

  constructor() {

  }
}
