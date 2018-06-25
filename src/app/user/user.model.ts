export class User {
    public id: string;
    public name: string;
    public lastName: string;
    public ci: string;
    public ciPlace: string;
    public mail: string;
    public phone: string;
    public displayName: string;
    public position: string;
    // public projects: Project[];
    // public assignedCompanies: Companies[];

    constructor(
        id: string,
        name: string,
        lastName: string,
        ci: string,
        ciPlace: string,
        mail: string,
        phone: string,
        displayName: string,
        position: string
    ) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.ci = ci;
        this.ciPlace = ciPlace;
        this.mail = mail;
        this.phone = phone;
        this.displayName = displayName;
        this.position = position;
    }

    static getUserFromSnapshot(user): User {
        const id = user.payload.doc.id;
        const data = user.payload.doc.data();
        return new User(id,
            data.name,
            data.lastName,
            data.ci,
            data.ciPlace,
            data.mail,
            data.phone,
            data.displayName,
            data.position
        )
    }

    static getUserFromValue(userId, user): User {
        return new User(
            userId,
            user.name,
            user.lastName,
            user.ci,
            user.ciPlace,
            user.mail,
            user.phone,
            user.displayName,
            user.position
        )
    }
}