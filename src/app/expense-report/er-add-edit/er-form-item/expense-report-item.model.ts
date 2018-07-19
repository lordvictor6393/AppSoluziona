export class ExpenseReportItem {
    public detail: string;
    public date: Date;
    public billNumber: string;
    public voucherNumber: string;
    public quantity: number;
    public singlePrice: number;
    public totalPrice: number;

    constructor(
        detail: string,
        date: number,
        billNumber: string,
        voucherNumber: string,
        quantity: number,
        singlePrice: number,
        totalPrice: number
    ) {
        this.detail = detail;
        this.date = new Date(date);
        this.billNumber = billNumber;
        this.voucherNumber = voucherNumber;
        this.quantity = quantity;
        this.singlePrice = singlePrice;
        this.totalPrice = totalPrice;
    }

    updateData(newData) {
        if (newData.detail) this.detail = newData.detail;
        if (newData.date) this.date = newData.date;
        if (newData.billNumber) this.billNumber = newData.billNumber;
        if (newData.voucherNumber) this.voucherNumber = newData.voucherNumber;
        if (newData.quantity) this.quantity = newData.quantity;
        if (newData.singlePrice) this.singlePrice = newData.singlePrice;
        if (newData.totalPrice) this.totalPrice = newData.totalPrice;
    }

    getRawObject() {
        return {
            detail: this.detail,
            date: this.date.getTime(),
            billNumber: this.billNumber,
            voucherNumber: this.voucherNumber,
            quantity: this.quantity,
            singlePrice: this.singlePrice,
            totalPrice: this.totalPrice
        }
    }
}