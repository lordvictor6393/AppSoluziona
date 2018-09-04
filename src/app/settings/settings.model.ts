interface EntityCounts {
    frCount: number;
    projectCount: number;
}

interface CompanyData {
    nit: string;
}

export class AppSettings {
    public entitiesCount: EntityCounts;
    public companyData: CompanyData;

    constructor(
        entitiesCount: EntityCounts,
        companyData: CompanyData
    ) {
        this.entitiesCount = entitiesCount;
        this.companyData = companyData;
    }
}
