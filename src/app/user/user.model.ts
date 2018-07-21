interface Roles {
    common?: boolean;
    accountant?: boolean;
    chief?: boolean;
}

export class User {
    public isDeleted: boolean;

    public id: string;
    public name: string;
    public lastName: string;
    public ci: string;
    public ciPlace: string;
    public mail: string;
    public phone: string;
    public displayName: string;
    public roles: Roles;
    public position: string;
    public projectIds: string[];
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
        roles: Roles,
        position: string,
        projectIds?: string[]
    ) {
        this.isDeleted = false;

        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.ci = ci;
        this.ciPlace = ciPlace;
        this.mail = mail;
        this.phone = phone;
        this.displayName = displayName;
        this.roles = roles || {};
        this.position = position;
        this.projectIds = projectIds || [];
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
            data.roles,
            data.position,
            data.projectIds
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
            user.roles,
            user.position,
            user.projectIds
        )
    }
}