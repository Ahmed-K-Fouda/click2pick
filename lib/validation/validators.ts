import { z } from "zod";
import { formatNumberWithDecimal } from "../utils";
import { PAYEMNT_METHODS } from "../constants";

const currecnyFormatted = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two deciaml places"
  );

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 charachters"),
  slug: z.string().min(3, "Slug must be at least 3 charachters"),
  category: z.string().min(3, "Category must be at least 3 charachters"),
  brand: z.string().min(3, "Brand must be at least 3 charachters"),
  description: z.string().min(3, "Description must be at least 3 charachters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currecnyFormatted,
});

// Sign-in users Schema
export const signInFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 charchter"),
});

// Sign-up users Schema
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "The name should be at least 3 charchters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 charchters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 charchters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
  });

// CART ITEM SCHEMA

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Product must me positive number"),
  image: z.string().min(1, "Image is required"),
  price: currecnyFormatted,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemPrice: currecnyFormatted,
  totalPrice: currecnyFormatted,
  shippingPrice: currecnyFormatted,
  taxPrice: currecnyFormatted,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

// Schema for shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 charchter"),
  streetAddress: z.string().min(3, "Address must be at least 3 charchter"),
  city: z.string().min(3, "City must be at least 3 charchter"),
  PostalCode: z.string().min(3, "Postal code must be at least 3 charchter"),
  country: z.string().min(3, "Country must be at least 3 charchter"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Schema for payment method
export const payemntMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYEMNT_METHODS.includes(data.type), {
    path: ["type"],
    error: "Invalid payment method",
  });

// Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemPrice: currecnyFormatted,
  shippingPrice: currecnyFormatted,
  taxPrice: currecnyFormatted,
  totalPrice: currecnyFormatted,
  paymentMethod: z.string().refine((data) => PAYEMNT_METHODS.includes(data), {
    error: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

// Schema for insert order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currecnyFormatted,
  qty: z.number(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// schema for update user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 charchter"),
  email: z.string().min(3, "Email must be at least 3 charchter"),
});
