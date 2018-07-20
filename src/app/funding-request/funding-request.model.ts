export class FundingRequest {
    public isDeleted: boolean;
    public isSent: boolean; 

    public id: string;
    public code: string;
    public createUserId: string;
    public clientId: string;
    public projectId: string;
    public date: Date;
    public state: string;
    public detail: string;
    public observations: string;
    public aproveUserId: string;
    public total: number;
    public items: {
        detail: string,
        quantity: number,
        singlePrice: number,
        totalPrice: number
    }[];
    public accordance: {
        paymentType: string,
        voucher: string,
        receiverUserId: string,
        deliverUserId: string
    };

    constructor (
        id: string,
        code: string,
        createUserId: string,
        clientId: string,
        projectId: string,
        date: number,
        state: string,
        detail: string,
        observations: string,
        aproveUserId: string,
        total: number,
        items: {
            detail: string,
            quantity: number,
            singlePrice: number,
            totalPrice: number
        }[],
        accordance: {
            paymentType: string,
            voucher: string,
            receiverUserId: string,
            deliverUserId: string
        },

        isSent?: boolean
    ) {
        this.isDeleted = false;
        this.isSent = isSent || false;

        this.id = id;
        this.code = code;
        this.createUserId = createUserId;
        this.clientId = clientId;
        this.projectId = projectId;
        this.date = new Date(date);   
        this.state = state;
        this.detail = detail;
        this.observations = observations;
        this.aproveUserId = aproveUserId;
        this.total = total;
        this.items = items;
        this.accordance = accordance;
    }

    static getFrFromSnapshot(frData): FundingRequest {
        const id = frData.payload.doc.id;
        const data = frData.payload.doc.data();
        return new FundingRequest(id,
            data.code,
            data.createUserId,
            data.clientId,
            data.projectId,
            data.date,
            data.state,
            data.detail,
            data.observations,
            data.aproveUserId,
            data.total,
            data.items,
            data.accordance,
            data.isSent
        );
    }

    static getFrFromValue(frId, frData): FundingRequest {
        return new FundingRequest(
            frId,
            frData.code,
            frData.createUserId,
            frData.clientId,
            frData.projectId,
            frData.date,
            frData.state,
            frData.detail,
            frData.observations,
            frData.aproveUserId,
            frData.total,
            frData.items,
            frData.accordance,
            frData.isSent
        );
    }
}