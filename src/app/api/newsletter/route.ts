import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_NEWSLETTER_LIST_ID = process.env.BREVO_NEWSLETTER_LIST_ID;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email?.trim();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Guard: Check if Shopify is configured
    if (!SHOPIFY_ADMIN_API_TOKEN) {
      console.error("Missing SHOPIFY_ADMIN_API_TOKEN in environment variables");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!SHOPIFY_STORE_DOMAIN) {
      console.error("Missing SHOPIFY_STORE_DOMAIN in environment variables");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Guard: Check if Brevo is configured
    if (!BREVO_API_KEY) {
      console.error("Missing BREVO_API_KEY in environment variables");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!BREVO_NEWSLETTER_LIST_ID) {
      console.error("Missing BREVO_NEWSLETTER_LIST_ID in environment variables");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Call both Shopify and Brevo APIs in parallel
    const shopifyUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/customers.json`;

    const [shopifyResponse, brevoResponse] = await Promise.all([
      // Call Shopify API
      fetch(shopifyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_TOKEN,
        },
        body: JSON.stringify({
          customer: {
            email,
            email_marketing_consent: {
              state: "subscribed",
              opt_in_level: "single_opt_in",
            },
          },
        }),
      }),
      // Call Brevo API to add/update contact and add to list
      fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          listIds: [parseInt(BREVO_NEWSLETTER_LIST_ID)],
          updateEnabled: true,
        }),
      }),
    ]);

    const shopifyData = await shopifyResponse.json();
    const brevoData = await brevoResponse.json();

    // Handle Shopify response
    if (shopifyResponse.status === 201) {
      // Shopify success
      if (brevoResponse.ok) {
        // Both succeeded
        return NextResponse.json({ success: true }, { status: 200 });
      } else {
        // Shopify success but Brevo failed - log but still return success
        console.error("Brevo API error:", brevoData);
        return NextResponse.json({ success: true }, { status: 200 });
      }
    }

    if (shopifyResponse.status === 422) {
      // Check if it's a "already taken" error (email already exists)
      const errors = shopifyData.errors;
      const emailErrors = errors?.email;

      if (
        Array.isArray(emailErrors) &&
        emailErrors.some(
          (e: string) =>
            typeof e === "string" &&
            e.toLowerCase().includes("already been taken")
        )
      ) {
        // Customer already exists in Shopify
        if (brevoResponse.ok) {
          // Try to add to Brevo anyway (they might not have it)
          return NextResponse.json(
            { success: true, alreadySubscribed: true },
            { status: 200 }
          );
        } else {
          // Log Brevo error but still return success since customer exists
          console.error("Brevo API error:", brevoData);
          return NextResponse.json(
            { success: true, alreadySubscribed: true },
            { status: 200 }
          );
        }
      }

      // Other 422 error - log and return error
      console.error("Shopify 422 error:", errors);
      return NextResponse.json(
        { success: false, message: "Failed to subscribe" },
        { status: 500 }
      );
    }

    // Other Shopify error status
    console.error(`Shopify API error (${shopifyResponse.status}):`, shopifyData);
    return NextResponse.json(
      { success: false, message: "Failed to subscribe" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
