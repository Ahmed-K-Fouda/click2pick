"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { DEFAULT_PAYEMNT_METHOD, PAYEMNT_METHODS } from "@/lib/constants";
import {
  payemntMethodSchema,
  shippingAddressSchema,
} from "@/lib/validation/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface IProps {
  preferredPaymentMethod: string | null;
}
const PaymentMethodForm = ({ preferredPaymentMethod }: IProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof payemntMethodSchema>>({
    resolver: zodResolver(payemntMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYEMNT_METHOD,
    },
  });
  const { handleSubmit, control } = form;

  const onSubmit = async (values: z.infer<typeof payemntMethodSchema>) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);
      if (!res.success) {
        toast.error(res.message);
      }
      router.push("/place-order");
    });
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Payment Method</h1>
        <p className="text-sm text-muted-foreground">
          Please select payment method
        </p>

        <Form {...form}>
          <form
            method="post"
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-5 md:flex-row ">
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        className="flex flex-col space-y-2 "
                      >
                        {PAYEMNT_METHODS.map((payment) => (
                          <FormItem
                            key={payment}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={payment}
                                checked={field.value === payment}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {payment}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}{" "}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default PaymentMethodForm;
