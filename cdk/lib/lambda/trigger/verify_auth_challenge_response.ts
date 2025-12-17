import {
  Context,
  Handler,
  VerifyAuthChallengeResponseTriggerEvent,
} from "aws-lambda";

/**
 * 認証コードの採点処理
 */
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
