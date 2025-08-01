import {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
} from "@/lib/validation/validators";
import z from "zod";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItems = z.infer<typeof cartItemSchema>;
