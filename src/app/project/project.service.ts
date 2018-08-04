import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Project } from './project.model';
import { UsersService } from '../user/user.service';
import { User } from '../user/user.model';
import { Client } from '../client/client.model';
import { ClientService } from '../client/client.service';
import { Observable } from '../../../node_modules/rxjs';
import { map } from '../../../node_modules/rxjs/operators';
import { AuthService } from '../auth/auth.service';

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
                if (!this.authService.CanReadProjects()) {
                    filteredList = projectList.filter(
                        project => {
                            const user = this.authService.loggedUserInstance;
                            if (user) {
                                return user.projectIds.indexOf(project.id) !== -1;
                            } else {
                                return false;
                            }
                        }
                    );
                    return filteredList;
                }
                return projectList;
            })
        );
    }

    getProject(projectId: string): Observable<Project> {
        if (projectId) {
            const projectRef = this.db.doc('projects/' + projectId);
            if (projectRef) {
                return projectRef.valueChanges().pipe(
                    map(project => {
                        if (project) {
                            return Project.getProjectFromValue(projectId, project);
                        }
                    })
                );
            } else {
                console.warn('Not able to get project ' + projectId + ' from db');
            }
        }
    }

    addProject(projectData) {
        if (projectData) {
            projectData.isDeleted = false;
            return this.projectsCollectionRef.add(projectData);
        }
    }

    updateProject(projId, projectData) {
        if (projId) {
            const members = projectData.membersIds;
            const projectRef = this.db.doc('projects/' + projId);
            if (this.users.length) {
                this.userService.registerProject(projectData.leadId, projId, true);
                members.forEach(memberId => {
                    this.userService.registerProject(memberId, projId);
                });
                if (projectRef) {
                    projectRef.update(projectData);
                } else {
                    console.warn('Cannot update project, not able to get project ' + projId);
                }
            } else {
                console.warn('project not saved/updated because users are not available.');
            }
        }
    }
    deleteProject(project: Project) {
        if (project) {
            const members = project.membersIds;
            const projectRef = this.db.doc('projects/' + project.id);
            if (this.users.length && this.clients.length) {
                this.clientService.unregisterProject(project.clientId, project.id);
                this.userService.unregisterProject(project.leadId, project.id, true);
                members.forEach(memberId => {
                    this.userService.unregisterProject(memberId, project.id);
                });
                if (projectRef) {
                    projectRef.delete();
                } else {
                    console.warn('Cannot remove project, not able to get project ' + project.id);
                }
            } else {
                console.warn('project not saved/updated because users are not available.');
            }
            // this.updateProject(projId, { isDeleted: true });
        }
    }

    generateProjectCode(): string {
        return 'PR-' + (this.localProjectList.length + 1);
    }

    getProjectName(projId: string) {
        if (projId) {
            if (this.localProjectList.length) {
                const projectInstance = this.localProjectList.find(project => project.id === projId);
                if (projectInstance) {
                    return projectInstance.name;
                } else {
                    console.warn('Not able to find project in local projects list');
                }
            } else {
                return '';
            }
        }
    }
}
