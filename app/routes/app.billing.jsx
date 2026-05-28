import { redirect } from "react-router";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { billing } = await authenticate.admin(request);

    const confirmation = await billing.request({
      plan: "Pro Plan",
      isTest: true,
      returnUrl: "https://herosection.unitradein.com/app",
    });

    return redirect(confirmation.confirmationUrl);
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    if (error.name === "AbortError" || error.message?.toLowerCase().includes("aborted")) {
      console.log("Billing request was aborted:", error.message);
      return new Response("Request aborted", { status: 499 });
    }
    console.error("Billing Error:", error);

    return new Response(
      `Failed to process subscription: ${error.message}`,
      { status: 500 }
    );
  }
}