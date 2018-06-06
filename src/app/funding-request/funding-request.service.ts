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

    getRequests() {
        return this.requests.slice();
    }
}