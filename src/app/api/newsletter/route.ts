import { NextRequest, NextResponse } from "next/server";

const BREVO_API_URL = "https://api.brevo.com/v3";

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
      const msg = addErr?.message || errData?.message || "Subscription failed";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    console.error("[api/newsletter] Brevo error:", createRes.status, errData);
    const msg = errData?.message || "Subscription failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  } catch (error) {
    console.error("[api/newsletter]", error);
    return NextResponse.json(
      { error: "Subscription failed" },
      { status: 500 }
    );
  }
}
