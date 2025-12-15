import { sendMail } from "@/repository/mail";
import { Context, CreateAuthChallengeTriggerEvent, Handler } from "aws-lambda";

export const handler: Handler<CreateAuthChallengeTriggerEvent> = async (
  event: CreateAuthChallengeTriggerEvent,
  _: Context
) => {
  const { email } = event.request.userAttributes;
  const secretCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await sendMail({
      to: email,
      subject: "認証コード",
      body: secretCode,
    });
  } catch (error) {}

  event.response.publicChallengeParameters = {
    email,
  };

  event.response.privateChallengeParameters = {
    answer: secretCode,
  };

  event.response.challengeMetadata = secretCode;

  return event;
};
