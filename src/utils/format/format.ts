import { URL_QUERY_PARAM } from "../../utils/constants/urls";

function formatToUKString(date: string) {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-UK', options);
}

function formatType(type: string): string {
    return type.split("-").join(" ");
}

function formatPostCompanyAuthUrl(url: string, companyNumber: string): string {
    return url.replace(`:${URL_QUERY_PARAM.PARAM_COMPANY_NUMBER}`, companyNumber);
}

export { formatToUKString, formatType, formatPostCompanyAuthUrl };
