export class User {
    public id: string;
    public name: string;
    public lastName: string;
    public ci: string;
    public ciPlace: string;
    public mail: string;
    public nickName: string;
    public password: string;
    public position: string;
    // public projects: Project[];
    // public assignedCompanies: Companies[];

    constructor (
        id: string,
        name: string,
        lastName: string,
        ci: string,
        ciPlace: string,
        mail: string,
        nickName: string,
        password: string,
        position: string
    ) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.ci = ci;
        this.ciPlace = ciPlace;
        this.mail = mail;
        this.nickName = nickName;
        this.password = password;
        this.position = position;
    }
}