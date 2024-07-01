import nodemailer from "nodemailer";
import { logger } from "./logger";
import { TP } from "@/config/env";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: TP.SERVICE,
  auth: {
    user: TP.USER,
    pass: TP.PASS,
  },
});

type MailOptions = {
  to: string;
  subject: string;
  from: string;
  text: string;
  html?: string;
};

const baseMailOptions: Pick<MailOptions, "from"> = {
  from: "Circle App <circleapp95@gmail.com>",
};

export const sendEmail = async (emailOptions: MailOptions) => {
  try {
    const response = await transporter.sendMail({ ...emailOptions });
    logger.info(response.response, "RESP");
    return response;
  } catch (err) {
    logger.error(err);
    return err;
  }
};

export const sendResetPasswordLink = async ({
  fullName,
  to,
  url,
}: {
  fullName: string;
  to: string;
  url: string;
}) => {
  await sendEmail({
    ...baseMailOptions,
    to,
    text: `Click here to reset your password ${url}`,
    subject: "Reset Password",
    html: resetPasswordHtml({ link: url, fullName: fullName }),
  });
};

export const sendVerifyEmailLink = async (to: string, url: string) => {
  await sendEmail({
    ...baseMailOptions,
    text: `Click here to verify your account ${url}`,
    subject: "Verify Account",
    to,
  });
};

export const sendSuccessfulVerifyAccount = async (to: string) => {
  await sendEmail({
    ...baseMailOptions,
    subject: "Verify Account",
    to,
    text: "Account successfully verified.",
  });
};

export const sendSuccessfulResetPassword = async (to: string) => {
  await sendEmail({
    ...baseMailOptions,
    subject: "Reset Password",
    to,
    text: "You have successfully reset your password.",
  });
};

export const sendSuccessfulChangePassword = async (to: string) => {
  await sendEmail({
    ...baseMailOptions,
    subject: "Change Password",
    to,
    text: "You have successfully changed your password. If you didn't change your password but you receive this email, you can submit request to reset your password.",
  });
};

const resetPasswordHtml = ({
  fullName,
  link,
}: {
  fullName: string;
  link: string;
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table width="600" cellpadding="20" cellspacing="0" style="border: 1px solid #dddddd;">
                    <tr>
                        <td>
                            <p>Dear ${fullName},</p>
                            <p>We have successfully reset your account password as per your request.</p>
                            <p>To complete the process, please click the button below to create a new password:</p>
                            <p style="text-align: center;">
                                <a href="${link}" style="background-color: #2F855A; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                            </p>
                            <p>For your security, this link will expire in [5 minutes, e.g., 24 hours]. If you did not request a password reset, you can ignore this email, only a person with access to this email can reset your account password.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
