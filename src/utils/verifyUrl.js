export function buildVerifyUrl(statementId) {
  const origin = window.location.origin.replace(/\/$/, '');
  return `${origin}/verify/${statementId}`;
}
