import { NextRequest, NextResponse } from "next/server";

const BREVO_API_URL = "https://api.brevo.com/v3";

// Generic message shown to the user. We NEVER forward Brevo's raw error
// text (which can leak server IP addresses and internal details) to the browser.
const GENERIC_ERROR = "Something went wrong. Please try again.";

/**
 * Detects Brevo's "unrecognised IP address" security block. When it happens the
 * server IP must be whitelisted in Brevo → Security → Authorized IPs (or IP
 * restriction disabled). We log a clear hint but keep the user-facing message generic.
 */
function isIpAuthError(err: unknown): boolean {
  const msg = (err && typeof err === "object" && "message" in err
    ? String((err as { message?: unknown }).message)
    : String(err)
  ).toLowerCase();
  return (
    msg.includes("unrecognised ip") ||
    msg.includes("unrecognized ip") ||
    msg.includes("ip address") ||
    msg.includes("authorised_ips") ||
    msg.includes("authorized_ips")
  );
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const listIdStr = process.env.BREVO_LIST_ID;
    if (!apiKey || !listIdStr) {
      return NextResponse.json(
        { error: "Newsletter service not configured" },
        { status: 503 }
      );
    }
    const listId = parseInt(listIdStr, 10);
    if (Number.isNaN(listId)) {
      return NextResponse.json(
        { error: "List not configured (BREVO_LIST_ID)" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    // 1. Create or update contact (updateEnabled = true merges with existing)
    const createRes = await fetch(`${BREVO_API_URL}/contacts`, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (createRes.ok) {
      return NextResponse.json({ success: true });
    }

    const errData = await createRes.json().catch(() => ({}));
    // Contact exists but not in list: add to list
    if (createRes.status === 400) {
      const addRes = await fetch(
        `${BREVO_API_URL}/contacts/lists/${listId}/contacts/add`,
        {
          method: "POST",
          headers: {
            "api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emails: [email] }),
        }
      );
      if (addRes.ok) {
        return NextResponse.json({ success: true });
      }
      const addErr = await addRes.json().catch(() => ({}));
      console.error("[api/newsletter] Brevo add-to-list:", addRes.status, addErr);
      if (isIpAuthError(addErr)) {
        console.error(
          "[api/newsletter] Brevo blocked the server IP. Whitelist it in Brevo → Security → Authorized IPs, or disable IP restriction."
        );
      }
      // Never forward Brevo's raw message (can leak IP addresses) to the client.
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
    }

    console.error("[api/newsletter] Brevo error:", createRes.status, errData);
    if (isIpAuthError(errData)) {
      console.error(
        "[api/newsletter] Brevo blocked the server IP. Whitelist it in Brevo → Security → Authorized IPs, or disable IP restriction."
      );
    }
    // Never forward Brevo's raw message (can leak IP addresses) to the client.
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
  } catch (error) {
    console.error("[api/newsletter]", error);
    return NextResponse.json(
      { error: GENERIC_ERROR },
      { status: 500 }
    );
  }
}
