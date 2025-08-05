import { generateAccessToken, paypal } from "../lib/paypal/paypal";

// Test to generate access token
test("generate token for paypal", async () => {
  const tokenResponse = await generateAccessToken();
  console.log(tokenResponse);
  expect(typeof tokenResponse).toBe("string");
  expect(tokenResponse.length).toBeGreaterThan(0);
});

// Test for paypal order
test("create paypal order", async () => {
  const token = await generateAccessToken();
  const price = 10.0;

  const orderResponse = await paypal.createOrder(price);
  console.log("Order ==>", orderResponse);

  expect(orderResponse).toHaveProperty("id");
  expect(orderResponse).toHaveProperty("status");
  expect(orderResponse.status).toBe("CREATED");
});

// Test to capture payment with mock order
test("Simulate capturing payment for an order", async () => {
  const orderId = "100";

  const mockPayment = jest.spyOn(paypal, "capturePayment").mockResolvedValue({
    status: "COMPLETED",
  });

  const captureResponse = await paypal.capturePayment(orderId);
  expect(captureResponse).toHaveProperty("status", "COMPLETED");

  mockPayment.mockRestore();
});
