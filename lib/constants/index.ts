export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "CLICK2PICK";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Shopping become eiser with click2pick";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCT_LIMIT =
  Number(process.env.LATEST_PRODUCT_LIMIT) || 4;

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValue = {
  fullName: "",
  streetAddress: "",
  city: "",
  country: "",
  PostalCode: "",
};

// PAYEMNT CONST

export const PAYEMNT_METHODS = process.env.PAYEMNT_METHODS
  ? process.env.PAYEMNT_METHODS.split(", ")
  : ["PayPal", "Stripe", "CashOnDelivery"];
export const DEFAULT_PAYEMNT_METHOD =
  process.env.DEFAULT_PAYEMNT_METHOD || "PayPal";
