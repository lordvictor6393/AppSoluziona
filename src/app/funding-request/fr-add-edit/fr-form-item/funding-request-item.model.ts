export class FundingRequestItem {
    public id: string;
    public detail: string;
    public quantity: number;
    public singlePrice: number;
    public totalPrice: number;

    constructor (
        id: string,
        detail: string,
        quantity: number,
        singlePrice: number,
        totalPrice: number
    ) {
        this.id = id;
        this.detail = detail;
        this.quantity = quantity;
        this.singlePrice = singlePrice;
        this.totalPrice = totalPrice;
    }
}