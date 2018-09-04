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
    static getAppSettingsFromSnapshot(configDocs): AppSettings {
        let counts = configDocs.find(doc => doc.payload.doc.id === 'entitiesCount');
        let companyData = configDocs.find(doc => doc.payload.doc.id === 'companyData');

        if (counts) { counts = counts.payload.doc.data(); }
        if (companyData) { companyData = companyData.payload.doc.data(); }

        return new AppSettings(counts, companyData);
    }
}
