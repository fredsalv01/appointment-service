import { createPool, Pool } from "mysql2";
import { CountryEnum } from "../../application/enum/CountryEnum";

export abstract class RdsClient {
    protected pool: Pool;

    constructor(country: CountryEnum) {
        const config = this.getCountryDbConfig(country);
        this.pool = createPool({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port
        })
    }

    protected getCountryDbConfig(country: CountryEnum) {
        if (country === 'PE') {
            return {
            host: process.env.RDS_PE_HOST!,
            user: process.env.RDS_PE_USER!,
            password: process.env.RDS_PE_PASSWORD!,
            database: process.env.RDS_PE_DB!,
            port: Number(process.env.RDS_PE_PORT || 3306),
            };
        } else {
            return {
            host: process.env.RDS_CL_HOST!,
            user: process.env.RDS_CL_USER!,
            password: process.env.RDS_CL_PASSWORD!,
            database: process.env.RDS_CL_DB!,
            port: Number(process.env.RDS_CL_PORT || 3306),
            };
        }
    }

}