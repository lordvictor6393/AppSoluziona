export class Project {
    public id: string;
    public code: string;
    public name: string;
    public leadId: string;
    public membersIds: string[];
    public budget: number;
    public clientId: string;
    public contactDetails: any;
    public totalExpense: number;
    public parentProjectId: string;
    public childProjectsIds: string[];

    constructor(
        id: string,
        name: string,
        code: string,
        leadId: string,
        membersIds: string[],
        budget: number,
        clientId: string,
        contactDetails: any,
        totalExpense: number,
        parentProjectId: string,
        childProjectsIds: string[]
    ) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.leadId = leadId;
        this.membersIds = membersIds;
        this.budget = budget;
        this.clientId = clientId;
        this.contactDetails = contactDetails;
        this.totalExpense = totalExpense;
        this.parentProjectId = parentProjectId;
        this.childProjectsIds = childProjectsIds;
    }

    static getProjectFromSnapshot(project): Project {
        const id = project.payload.doc.id;
        const data = project.payload.doc.data();
        return new Project(id,
            data.name,
            data.code,
            data.leadId,
            data.membersIds,
            data.budget,
            data.clientId,
            data.contactDetails,
            data.totalExpense,
            data.parentProjectId,
            data.childProjectsIds
        )
    }

    static getProjectFromValue(projectId, project): Project {
        return new Project(
            projectId,
            project.name,
            project.code,
            project.leadId,
            project.membersIds,
            project.budget,
            project.clientId,
            project.contactDetails,
            project.totalExpense,
            project.parentProjectId,
            project.childProjectsIds
        )
    }
}