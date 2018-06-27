import { Injectable } from "@angular/core";
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from "angularfire2/firestore";
import { Project } from "./project.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ProjectService {
    private projectRef: AngularFirestoreDocument;
    private projectsCollectionRef: AngularFirestoreCollection<Project>;

    constructor(private db:AngularFirestore) {
        this.projectsCollectionRef = this.db.collection('projects');
    }

    getProjectList(): Observable<Project[]> {
        return this.projectsCollectionRef.snapshotChanges().pipe(
            map(projectsList => projectsList.map(Project.getProjectFromSnapshot))
        );
    }
    getProject(projectId: string): Observable<Project> {
        this.projectRef = this.db.doc('projects/' + projectId);
        return this.projectRef.valueChanges().pipe(
            map(project => Project.getProjectFromValue(projectId, project))
        );
    }
    addProject(projectData) {
        this.projectsCollectionRef.add(projectData);
    }
    updateProject(projectData) {
        this.projectRef.update(projectData);
    }
}