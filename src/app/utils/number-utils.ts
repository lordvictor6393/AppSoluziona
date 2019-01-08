export default class NumberUtils {
    static add(target: any, amount = 1): number {
        if (target) {
            if (target % 1 || amount % 1) {
                target *= 100;
                amount *= 100;
                return (target + amount) / 100;
            } 
            return target + amount;
        } else {
            return amount;
        }
    }
}