import crypto from "crypto";
import { env } from "@/lib/env";

export function verify2CheckoutINS(params: Record<string, string>) {
  const {
    sale_id,
    invoice_id,
    vendor_id,
    md5_hash,
  } = params;

  if (!sale_id || !invoice_id || !vendor_id || !md5_hash) {
    return false;
  }

  const secretWord = env.TWOCHECKOUT_INS_SECRET_WORD;

  const stringToHash =
    sale_id + vendor_id + invoice_id + secretWord;

  const expectedHash = crypto
    .createHash("md5")
    .update(stringToHash)
    .digest("hex")
    .toUpperCase();

  return expectedHash === md5_hash;
}
