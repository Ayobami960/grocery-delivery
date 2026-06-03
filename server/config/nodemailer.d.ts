declare const sendEmail: ({ to, subject, body }: {
    to: string;
    subject: string;
    body: string;
}) => Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo>;
export default sendEmail;
//# sourceMappingURL=nodemailer.d.ts.map