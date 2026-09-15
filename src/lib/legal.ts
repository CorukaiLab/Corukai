export const LEGAL_UPDATED_AT = "15 de septiembre de 2026";

export const legalIdentity = {
  name: process.env.CORUKAI_LEGAL_NAME?.trim() || "Francisco Jose Coto Rueda",
  taxId: process.env.CORUKAI_LEGAL_ID?.trim() || "",
  address: process.env.CORUKAI_LEGAL_ADDRESS?.trim() || "",
  email: process.env.CORUKAI_LEGAL_EMAIL?.trim() || "ramecoru@gmail.com",
};

export const hasCompleteLegalIdentity = Boolean(
  legalIdentity.name && legalIdentity.taxId && legalIdentity.address,
);
