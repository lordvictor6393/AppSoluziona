export class FundingRequestItem {
    public detail: string;
    public quantity: number;
    public singlePrice: number;
    public totalPrice: number;

    constructor(
        detail: string,
        quantity: number,
        singlePrice: number,
        totalPrice: number
    ) {
        this.detail = detail;
        this.quantity = quantity;
        this.singlePrice = singlePrice;
        this.totalPrice = totalPrice;
    }

    updateData(newData) {
        if (newData.detail) this.detail = newData.detail;
        if (newData.quantity) this.quantity = newData.quantity;
        if (newData.singlePrice) this.singlePrice = newData.singlePrice;
        if (newData.totalPrice) this.totalPrice = newData.totalPrice;
    }

    getRawObject() {
        return {
            detail: this.detail,
            quantity: this.quantity,
            singlePrice: this.singlePrice,
            totalPrice: this.totalPrice
        }
    }
}