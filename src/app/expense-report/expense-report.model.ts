interface dbErItem {
    detail: string,
    date: number,
    billNumber: string,
    voucherNumber: string,
    quantity: number,
    singlePrice: number,
    totalPrice: number
}

interface dbAccordance {
    serviceOrder: string,
    voucher: string,
    receiverUserId: string
}

interface dbErActivity {
    action: string,
    userId: string,
    date: number,
    reason?: string
}

export class ExpenseReport {
    public isDeleted: boolean;
    public isSent: boolean;

    public id: string;
    public frId: string;
    public projectId: string;
    public code: string;
    public createUserId: string;
    public state: string;
    public totalSpent: number;
    public totalReceived: number;
    public balance: number;
    public observations: string;
    public place: string;
    public date: Date;
    public items: dbErItem[];
    public accordance: dbAccordance;
    public approveUserId: string;
    public activity: dbErActivity[];

    constructor(
        id: string,
        frId: string,
        projectId: string,
        code: string,
        createUserId: string,
        state: string,
        totalSpent: number,
        totalReceived: number,
        balance: number,
        observations: string,
        place: string,
        date: number,
        items: dbErItem[],
        accordance: dbAccordance,
        approveUserId: string,

        isSent?: boolean,
        activity?: dbErActivity[]
    ) {
        this.isDeleted = false;
        this.isSent = isSent || false;

        this.id = id;
        this.frId = frId;
        this.projectId = projectId;
        this.code = code;
        this.createUserId = createUserId;
        this.state = state;
        this.totalSpent = totalSpent;
        this.totalReceived = totalReceived;
        this.balance = balance;
        this.observations = observations;
        this.place = place;
        this.date = new Date(date);
        this.items = items;
        this.accordance = accordance;
        this.approveUserId = approveUserId || '';
        this.activity = activity || [];
    }

    static getErFromSnapshot(erData): ExpenseReport {
        const id = erData.payload.doc.id;
        const data = erData.payload.doc.data();
        return new ExpenseReport(id,
            data.frId,
            data.projectId,
            data.code,
            data.createUserId,
            data.state,
            data.totalSpent,
            data.totalReceived,
            data.balance,
            data.observations,
            data.place,
            data.date,
            data.items,
            data.accordance,
            data.approveUserId,
            data.isSent,
            data.activity
        );
    }

    static getErFromValue(erId, erData): ExpenseReport {
        return new ExpenseReport(
            erId,
            erData.frId,
            erData.projectId,
            erData.code,
            erData.createUserId,
            erData.state,
            erData.totalSpent,
            erData.totalReceived,
            erData.balance,
            erData.observations,
            erData.place,
            erData.date,
            erData.items,
            erData.accordance,
            erData.approveUserId,
            erData.isSent,
            erData.activity
        );
    }
}