export const LEGAL_UPDATED_AT = "18 de septiembre de 2026";

export const legalIdentity = {
  name: process.env.CORUKAI_LEGAL_NAME?.trim() || "Francisco Jose Coto Rueda",
  taxId: process.env.CORUKAI_LEGAL_ID?.trim() || "53632685C",
  address: process.env.CORUKAI_LEGAL_ADDRESS?.trim() || "Calle Alfauir 4, 46702 Gandia, Valencia, España",
  email: process.env.CORUKAI_LEGAL_EMAIL?.trim() || "ramecoru@gmail.com",
};
