import transporter from "@/config/emailConfig";
import { render } from "@react-email/components";

export const sendMail = async (to: string, subject: string, html: string) => {

    const options = {
        from: process.env.HOST_MAIL,
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(options);
        console.log("Email sent successfully");
    } catch (error) {
        console.log(error);
        throw new Error("Error sending email");
    }
}