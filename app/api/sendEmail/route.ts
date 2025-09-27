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
                        TextPart: `Name: ${firstName} ${lastName}
						Email: ${email}
						Phone: ${countryCode} ${phoneNumber}
						Categories: ${categoriesString || "N/A"}
						Message:
						${message}
						___________________________________
						This message was submitted via Drive Insight's contact form`,
						HTMLPart:`<div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
							<h2>Form Submission: ${firstName} ${lastName} - ${firstCategory}</h2>
							<table style="border-collapse: collapse; margin-top: 10px;">
								<tr><td><strong>Name:</strong></td><td>${firstName} ${lastName}</td></tr>
								<tr><td><strong>Email:</strong></td><td>${email}</td></tr>
								<tr><td><strong>Phone:</strong></td><td>${countryCode} ${phoneNumber}</td></tr>
								<tr><td><strong>Category:</strong></td><td>${categoriesString || "N/A"}</td></tr>
							</table>
							<div style="margin-top: 20px;">
							<strong>Message:</strong>
							<p style="white-space: pre-wrap;">${message}</p>
							</div>
							<hr style="margin-top: 30px;" />
								<p style="font-size: 12px; color: #888;">
								This message was sent via Drive Insight's contact form.
								</p>
						</div>`
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
