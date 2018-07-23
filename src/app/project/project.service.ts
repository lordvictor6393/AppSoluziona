import { Injectable } from "@angular/core";
import { AngularFirestoreCollection, AngularFirestore } from "angularfire2/firestore";
import { Project } from "./project.model";
import { UsersService } from "../user/user.service";
import { User } from "../user/user.model";
import { Client } from "../client/client.model";
import { ClientService } from "../client/client.service";
import { Observable } from "../../../node_modules/rxjs";
import { map } from "../../../node_modules/rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class ProjectService {
    private users: User[];
    private clients: Client[];
    private localProjectList: Project[] = [];
    private projectsCollectionRef: AngularFirestoreCollection<Project>;

    constructor(private db: AngularFirestore,
        private userService: UsersService,
        private authService: AuthService,
        private clientService: ClientService) {
        this.userService.getUserList().subscribe(userList => this.users = userList);
        this.clientService.getClientList().subscribe(clientList => this.clients = clientList);
        this.projectsCollectionRef = this.db.collection('projects', ref => ref.where('isDeleted', '==', false));
        this.projectsCollectionRef.snapshotChanges().subscribe(
            projectList => {
                this.localProjectList = projectList.map(Project.getProjectFromSnapshot);
            }
        );
    }

    getProjectList(): Observable<Project[]> {
        return this.projectsCollectionRef.snapshotChanges().pipe(
            map(projectList => projectList.map(Project.getProjectFromSnapshot)),
            map(projectList => {
                let filteredList = [];
                if(!this.authService.CanReadProjects()) {
                    filteredList = projectList.filter(
                        project => {
                            let user = this.authService.loggedUserInstance;
                            if(user) return user.projectIds.indexOf(project.id) !== -1;
                            else return false;
                        }
                    );
                    return filteredList;
                }
                return projectList;
            })
        );
    }

    getProject(projectId: string): Observable<Project> {
        let projectRef = this.db.doc('projects/' + projectId);
        if (projectRef) {
            return projectRef.valueChanges().pipe(
                map(project => {
                    if (project) {
                        return Project.getProjectFromValue(projectId, project);
                    }
                })
            );
        } else {
            console.error('Not able to get project ' + projectId + ' from db');
        }
    }

    addProject(projectData) {
        projectData.isDeleted = false;
        return this.projectsCollectionRef.add(projectData);
    }

    updateProject(projId, projectData) {
        let members = projectData.membersIds;
        let projectRef = this.db.doc('projects/' + projId);
        if (this.users.length) {
            this.userService.registerProject(projectData.leadId, projId, true);
            members.forEach(memberId => {
                this.userService.registerProject(memberId, projId);
            });
            if (projectRef) {
                projectRef.update(projectData);
            } else {
                console.error('Cannot update project, not able to get project ' + projId);
            }
        } else {
            console.error('project not saved/updated because users are not available.')
        }
    }
    deleteProject(projId: string) {
        this.updateProject(projId, { isDeleted: true });
    }

    generateProjectCode(): string {
        return 'PR-' + (this.localProjectList.length + 1);
    }

    getProjectName(projId: string) {
        if (this.localProjectList.length) {
            let projectInstance = this.localProjectList.find(project => project.id == projId);
            if (projectInstance) {
                return projectInstance.name;
            } else {
                console.error('Not able to find project in local projects list');
            }
        } else return '';
    }
}