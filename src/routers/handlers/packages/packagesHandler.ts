import { Request, Response } from "express";
import { GenericHandler } from "../generic";
import { logger } from "../../../utils/logger";
import { PACKAGE_ACCOUNTS, PackageAccountsDescriptions } from "../../../types/package.accounts";

export class AccountPackages extends GenericHandler {
    constructor () {
        super()
        this.viewData.title = "Zip Accounts Packages"
        this.viewData.sampleKey = "Sample value for packages page screen"
        this.viewData.packageAccounts = this.setPackageAccounts()
    }

    execute(_req: Request, _response: Response): Promise<Object> {
        logger.info('GET request to serve accounts packages page')
        return Promise.resolve(this.viewData)
    }

    setPackageAccounts(): Record<string, string | number | undefined>[]{
        const packages: Record<string, string | number | undefined>[] = []
        const values = Object.values(PACKAGE_ACCOUNTS)

        values.forEach(value => packages.push(PackageAccountsDescriptions[value]))
        return packages
    }
}