import { Project } from "../project/project.model";

export class Client {
    public id: string;
    public name: string;
    public contactDetails: any;
    // public projectsIds: string[];
    public projects: Project[];

    constructor(
        id: string,
        name: string,
        contactDetails: any,
        // projectsIds: string[],
        projects: Project[]
    ) {
        this.id = id;
        this.name = name;
        this.contactDetails = contactDetails;
        // this.projectsIds = projectsIds;
        this.projects = projects;
    }
}