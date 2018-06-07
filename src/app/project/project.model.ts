import { User } from "../user/user.model";
import { Client } from "../client/client.model";

export class Project {
    public id: string;
    public name: string;
    // public parentProjectId: string;
    public parentProject: Project;
    // public childProjectsIds: string[];
    public childProjects: Project[];
    // public membersIds: String[];
    public members: User[];
    // public leadId: String;
    public lead: User;
    public totalExpense: number;
    public budget: number;
    public contactDetails: any;
    public client: Client;

    constructor (
        id: string,
        name: string,
        // parentProjectId: string,
        parentProject: Project,
        // childProjectsIds: string[],
        childProjects: Project[],
        // membersIds: String[],
        members: User[],
        // leadId: String,
        lead: User,
        totalExpense: number,
        budget: number,
        contactDetails: any,
        client: Client
    ) {
        this.id = id;
        this.name = name;
        // this.parentProjectId = parentProjectId;
        this.parentProject = parentProject;
        // this.childProjectsIds = childProjectsIds;
        this.childProjects = childProjects;
        // this.membersIds = membersIds;
        this.members = members;
        // this.leadId = leadId;
        this.lead = lead;
        this.totalExpense = totalExpense;
        this.budget = budget;
        this.contactDetails = contactDetails;
        this.client = client;
    }
}