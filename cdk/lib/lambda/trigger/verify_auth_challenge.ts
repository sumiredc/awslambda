import {
  Context,
  Handler,
  VerifyAuthChallengeResponseTriggerEvent,
} from "aws-lambda";

export const handler: Handler<VerifyAuthChallengeResponseTriggerEvent> = async (
  event: VerifyAuthChallengeResponseTriggerEvent,
  _: Context
) => {
  event.response.answerCorrect = isCorrect(event);

  return event;
};

function isCorrect(event: VerifyAuthChallengeResponseTriggerEvent) {
  return (
    event.request.challengeAnswer ===
    event.request.privateChallengeParameters.answer
  );
}
