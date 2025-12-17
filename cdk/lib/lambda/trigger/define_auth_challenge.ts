import {
  DefineAuthChallengeTriggerEvent,
  DefineAuthChallengeTriggerHandler,
} from "aws-lambda";

export const handler: DefineAuthChallengeTriggerHandler = async (
  event: DefineAuthChallengeTriggerEvent
) => {
  console.log("EVENT", event);
  const { session } = event.request;

  // 1. SRP_A (パスワード検証) がまだ行われていない、または失敗している場合
  // パスワード認証フロー(USER_PASSWORD_AUTH)の場合、最初はここを通ります
  if (session.length === 0) {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "SRP_A"; // まずパスワード認証をさせる

    return event;
  }

  const lastSession = session.slice(-1)[0];

  // 2. パスワード検証 (SRP_A または PASSWORD_VERIFIER) が成功した直後
  // 次のステップとして「カスタム認証」を要求します
  if (
    session.length === 1 &&
    lastSession.challengeResult === true &&
    (lastSession.challengeName === "SRP_A" ||
      lastSession.challengeName === "PASSWORD_VERIFIER")
  ) {
    console.log("challengeName", lastSession.challengeName);

    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE"; // CreateAuthChallenge をコール

    return event;
  }

  // 3. カスタム認証 (認証コード) の答え合わせが終わった後
  if (lastSession.challengeName === "CUSTOM_CHALLENGE") {
    if (lastSession.challengeResult === true) {
      // 正解 -> ログイン成功
      event.response.issueTokens = true;
      event.response.failAuthentication = false;

      return event;
    } else {
      // 不正解 -> 再試行させるかどうか判定
      // パスワード認証(1回) + カスタム認証失敗(3回) = 合計4回まで許容する例
      if (session.length < 4) {
        event.response.issueTokens = false;
        event.response.failAuthentication = false;
        event.response.challengeName = "CUSTOM_CHALLENGE"; // 新しいコードを再送

        return event;
      }
    }
  }

  // 4. それ以外（コード間違いなど）
  event.response.issueTokens = false;
  event.response.failAuthentication = true;

  return event;
};
