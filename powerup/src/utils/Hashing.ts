// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
export async function digestMessage(message: string) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
  return hashHex;
}

export type OrgAndBoardHashes = [org: string, board: string];

export async function calculateHashes(t: Trello.PowerUp.AnonymousHostHandlers): Promise<OrgAndBoardHashes> {
  const organisation = await t.organization("id");
  const board = await t.board("id");
  const organisationIdHash = await digestMessage(organisation.id);
  const boardIdHash = await digestMessage(board.id);
  return [organisationIdHash, boardIdHash];
}
