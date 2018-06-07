import { FundingRequest } from "./funding-request.model";

export class FundingRequestService {
    private requests: FundingRequest[] = [
        new FundingRequest(
            'rf001',
            'Javier Lopez',
            'Aprobado',
            'Antenas',
            'Pago de contrato'
        ),
        new FundingRequest(
            'rf002',
            'Juan Perez',
            'Aprobado',
            'Antenas',
            'Compra de materiales'
        ),
        new FundingRequest(
            'rf003',
            'Javier Lopez',
            'Pendiente',
            'Radiobases',
            'Compra de pasaje'
        )
    ];

    getFundingRequests() {
        return this.requests.slice();
    }

    getFundingRequest(id: string) {
        const request = this.requests.find(
            fr => { return fr.id === id; }
        );
        return request;
    }
}