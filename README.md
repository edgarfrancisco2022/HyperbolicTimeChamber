# HyperbolicTimeChamber
A Responsive Full Stack Productivity App 💻 - Junior Portfolio Project #2
<br>
Checkout the [Live View](http://44.201.211.71)!

## Reason
HyperbolicTimeChamber is a simple productivity app based on the idea that tracking the time one spends working on one's projects and goals is helpful to stay productive in the long run. It can be seen as the opposite of techniques such as the "Pomodoro Technique", which focus on short term productivity. 

## Description
Projects can be created where sessions may be added. Session duration, session description, session quality, and session start and end times are recorded in a session. Each project tracks its number of sessions and the total amount of time. A chronometer is used to track the session time. 

## Challenges
In building this app we encountered three major challenges.
1. Keeping a "Demo Project" in local storage while keeping all created projects in a database. This made the frontend logic more complex than initially expected.
3. Intercomponent Communication. For each major user action, events have to travel through several components and services, this also proved to be more difficult than initially expected. 
5. Saving the state of each project (expanded or collapsed), as each user action, from logging in, to adding and deleting a session, to creating or deleting a project, required a slightly different implementation.

## Solutions
1. Two Angular services were created in the frontend to keep the data, one for the Demo Project and one for all projects (including both the Demo Project and projects stored in the database). This made the Demo Project, which also had to be linked to the project stored in local storage, more managable.
2. Use of Angular Observables from the RxJS library, specifically BehaviorSubject\<boolean\>, which were kept in dedicated services, and to which components subscribe upon component initiation, turned out to be a simple solution to the problem of Intercomponent Communication.
3. A "brute force" solution was implemented to solve the project state management problem. We used boolean variables to indicate which type of user action to handle, and using if statements we created a slightly different implementation for each. 

## Areas of improvement and potential enhancements.
1. Although functional, the state management solution could be further improved by using TypeScript classes to handle each particular case to make the code more readable and maintainable.
2. Functionality to keep track of the total time spent on all projects could be added.

## Tech Stack
##### Backend
1. MySQL
2. Spring Data JPA with Hibernate
3. Spring Security with JWT
3. Spring Boot
4. Java

##### Frontend
5. HTML
6. CSS
7. Bootstrap
8. JavaScript
9. Typescript
10. Angular

##### Server
1. AWS EC2

## Features
1. Demo Project in local storage.
2. Creating projects (database only).
3. Deleting projects (database only).
4. Creating Sessions.
5. Session star rating (1-5).
6. Save session modal.
7. Deleting Sessions.
8. Project selection.
9. Chronometer functionality.
10. User registration.
11. User login.
12. Project state tracking [expanded or collapsed].
13. Fully responsive.    

## EER Diagram
![alt text](https://github.com/edgarfrancisco2022/HyperbolicTimeChamber/blob/main/HyperbolicTimeChamber%20EER%20Diagram.png?raw=true)

## Preview
Just a preview 👀. Checkout the [Live View](http://44.201.211.71) for more!
   
![alt text](https://github.com/edgarfrancisco2022/HyperbolicTimeChamber/blob/main/HyperbolicTmeChamber%20Chronometer.png)
   
