import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

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

    // Guard: Check if Admin API token is configured
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

    const shopifyUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/customers.json`;

    const response = await fetch(shopifyUrl, {
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
    });

    const responseData = await response.json();

    if (response.status === 201) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (response.status === 422) {
      // Check if it's a "already taken" error (email already exists)
      // Shopify returns errors as: {"errors": {"email": ["has already been taken"]}}
      const errors = responseData.errors;
      const emailErrors = errors?.email;

      if (
        Array.isArray(emailErrors) &&
        emailErrors.some(
          (e: string) =>
            typeof e === "string" &&
            e.toLowerCase().includes("already been taken")
        )
      ) {
        // Customer already exists - treat as success for newsletter signup
        return NextResponse.json(
          { success: true, alreadySubscribed: true },
          { status: 200 }
        );
      }

      // Other 422 error - log and return error
      console.error("Shopify 422 error:", errors);
      return NextResponse.json(
        { success: false, message: "Failed to subscribe" },
        { status: 500 }
      );
    }

    // Other error status
    console.error(`Shopify API error (${response.status}):`, responseData);
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
