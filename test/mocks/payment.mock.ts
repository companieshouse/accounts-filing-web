import { Payment } from "@companieshouse/api-sdk-node/dist/services/payment";

export const PAYMENT_JOURNEY_URL = "paymentJourneyUrl";

export const mockPayment = {
    amount: "34",
    availablePaymentMethods: ["methods"],
    companyNumber: "12345678",
    completedAt: "2024-05-17",
    createdAt: "2024-05-17",
    createdBy: {
        email: "demo@test.com",
        forename: "test forename",
        id: "154624",
        surname: "test surname"
    },
    description: "payment",
    etag: "12458",
    kind: "kind",
    links: {
        journey: PAYMENT_JOURNEY_URL
    },
    paymentMethod: "visa",
    reference: "3432",
    status: "paid"
} as Payment;
