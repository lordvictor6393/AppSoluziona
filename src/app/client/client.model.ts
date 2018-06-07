import { Project } from "../project/project.model";

export class Client {
    public id: string;
    public name: string;
    public contactDetails: { name: string, phone: string};
    public projectsIds: string[];

    constructor(
        id: string,
        name: string,
        contactDetails: any,
        projectsIds: string[]
    ) {
        this.id = id;
        this.name = name;
        this.contactDetails = contactDetails;
        this.projectsIds = projectsIds;
    }

    static getClientFromSnapshot(client): Client {
        const data = client.payload.doc.data();
        const id = client.payload.doc.id;
        return new Client(id, data.name, data.contactDetails, data.projectsIds);
    }
}