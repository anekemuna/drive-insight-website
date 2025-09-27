import { NextResponse } from "next/server";
import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC!,
    process.env.MJ_APIKEY_PRIVATE!,
    {
        config: {},
        options: {},
    },
);

export async function POST(req: Request) {
    try {
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            countryCode,
            message,
			category,
        } = await req.json();

        if (!firstName || !lastName || !email || !message) {
            return NextResponse.json(
                { message: "Missing fields" },
                { status: 400 },
            );
        }

		const firstCategory = Array.isArray(category) && category.length > 0 ? category[0] : "";
		const categoriesString = category && category.length > 0 ? category.join(", ") : "";



        const request = await mailjet
            .post("send", { version: "v3.1" })
            .request({
                Messages: [
                    {
                        From: {
                            Email: process.env.MJ_SENDER_EMAIL!,
                            Name: "Drive Insight Contact Form",
                        },
                        To: [
                            {
                                Email: process.env.MJ_RECEIVER_EMAIL!,
                                Name: "Customer Service Team",
                            },
                            {
                                Email: process.env.MJ_RECEIVER2_EMAIL!,
                                Name: "Customer Service Team",
                            },
                        ],
                        Subject: `Form Submission: ${firstName} ${lastName} - ${firstCategory}`,
                        TextPart: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${countryCode} ${phoneNumber}\nMessage:\n${message}\nCategories: ${categoriesString}`,
                    },
                ],
            });
        console.log("MailJet Response:", request.body);
        return NextResponse.json(
            { message: "Email sent successfully" },
            { status: 200 },
        );
    } catch (err) {
        console.error("Mailjet error:", err);
        return NextResponse.json(
            { message: "Error sending email" },
            { status: 500 },
        );
    }
}
