import axios from "axios";

const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY!;

export async function createInvoice(data: {
    externalId: string;
    amount: number;
    description: string;
    payerEmail: string;
}) {
    const response = await axios.post(
        "https://api.xendit.co/v2/invoices",
        {
            external_id: data.externalId,
            amount: data.amount,
            description: data.description,
            payer_email: data.payerEmail,
            currency: "IDR",
            success_redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/orders`,
            failure_redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
        },
        {
            auth: {
                username: XENDIT_SECRET_KEY,
                password: "",
            },
        }
    );

    return response.data;
}