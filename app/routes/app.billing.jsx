import { redirect } from "react-router";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { billing } = await authenticate.admin(request);

  await billing.require({
    plans: ["Pro Plan"],
    isTest: true,
    onFailure: async () =>
      billing.request({
        plan: "Pro Plan",
        isTest: true,
        returnUrl: "https://herosection.unitradein.com/app",
      }),
  });

  return redirect("/app");
}