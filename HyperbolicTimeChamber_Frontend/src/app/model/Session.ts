import { Project } from "./Project";
import { User } from "./User";

export class Session {
  id: number;
  description: string;
  startTime: Date;
  endTime: Date;
  totalTime: number;
  project: Project;
  sessionQuality: number;
  sessionUser: User;

  constructor(
              description: string,
              sessionQuality: number,
              totalTime: number, startTime: Date, endTime: Date,
              sessionUser: User) {

    this.description = description;
    this.sessionQuality = sessionQuality;
    this.totalTime = totalTime;
    this.startTime = startTime;
    this.endTime = endTime;
    this.sessionUser = sessionUser;
  }

}
