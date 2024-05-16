import { env } from "../../config";

export const fees: Record<string, string> = {
    cic: env.CIC_FEE,
    overseas: env.OVERSEAS_FEE,
};
