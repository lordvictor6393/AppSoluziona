import { FundingRequestItem } from "./fr-add-edit/fr-form-item/funding-request-item.model";

export class FundingRequest {
    public id: string;
    public disclaimerId: string;
    public createUser: string;
    public clientId: string;
    public date: Date;
    public state: string;
    public projectName: string;
    public detail: string;
    public observations: string;
    public aproveUser: string;
    public total: number;
    public items: FundingRequestItem[];
    public confimity: {
        id: string,
        paymentType: string,
        voucher: string,
        receiverUser: string,
        deliverUser: string
    };

    constructor (
        id: string,
        // disclaimerId: string,
        createUser: string,
        
        // clientId: string,
        // date: Date,
        
        state: string,
        projectName: string,
        detail: string//,
        
        // observations: string,
        // aproveUser: string,
        // total: number,
        // items: RequestItem[],
        // confimity: {
        //     id: string,
        //     paymentType: string,
        //     voucher: string,
        //     receiverUser: string,
        //     deliverUser: string
        // }
    ) {
        this.id = id;
        // this.disclaimerId = disclaimerId;
        this.createUser = createUser;
        // this.clientId = clientId;
        // this.date = date;
        
        
        this.state = state;
        this.projectName = projectName;
        this.detail = detail;
        
        
        // this.observations = observations;
        // this.aproveUser = aproveUser;
        // this.total = total;
        // this.items = items;
        // this.confimity = confimity;
    }
}