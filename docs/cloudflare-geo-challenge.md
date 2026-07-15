# Cloudflare — challenge US + Singapore traffic (bot & data-pollution defense)

Goal: stop bot traffic and analytics/data pollution from the US and Singapore
(which are **not** sales markets — the shop ships EU only) **without** hurting SEO.

> ⚠️ **Why "challenge" and not "block":** Googlebot, Bingbot, and most link/preview
> crawlers request the site from **US IP addresses**. A hard country block would
> block Googlebot → the site can be **de-indexed from Google**. The rule below uses
> a **Managed Challenge** and **excludes verified bots** (`not cf.client.bot`), so
> Google/Bing pass through untouched while unknown US/SG traffic gets challenged.

This is a **Cloudflare dashboard** change — it is not in the app code. Steps below.

---

## The rule

**Field expression** (Edit expression → paste):

```
(ip.geoip.country in {"US" "SG"}) and not cf.client.bot
```

**Action:** `Managed Challenge`

- `ip.geoip.country in {"US" "SG"}` → traffic geolocated to the US or Singapore.
- `not cf.client.bot` → excludes Cloudflare-**verified** bots (Googlebot, Bingbot,
  etc.), so search engines are never challenged. Malicious/unknown bots are **not**
  verified and will still get the challenge.

---

## Steps (Cloudflare dashboard)

1. Log in to Cloudflare → select the **vdubscards.com** zone.
2. Go to **Security → WAF → Custom rules** (older UI: **Security → WAF → Firewall rules**).
3. Click **Create rule**.
4. **Rule name:** `Challenge US + SG (exclude verified bots)`.
5. Click **Edit expression** and paste:
   ```
   (ip.geoip.country in {"US" "SG"}) and not cf.client.bot
   ```
6. **Then take action…** → choose **Managed Challenge**.
7. **Deploy**.

Verify: open the site through a US VPN → you should see the Cloudflare challenge.
Then check Google Search Console → **URL Inspection → Test live URL** on the homepage;
it must still fetch successfully (Googlebot is exempt).

---

## Tuning options

- **Add more countries:** extend the set, e.g.
  `(ip.geoip.country in {"US" "SG" "CN" "IN"}) and not cf.client.bot`.
- **Stricter (block instead of challenge)** — only if you accept the SEO risk and are
  sure no crawler you care about lives there. Keep the verified-bot exclusion:
  `(ip.geoip.country in {"US" "SG"}) and not cf.client.bot` → action **Block**.
- **EU-only allowlist (advanced, aggressive):** challenge everything *except* the EU.
  This is powerful but easy to get wrong (blocks legitimate travelers, some CDNs, and
  crawlers) — test carefully before deploying:
  ```
  (not ip.geoip.country in {"NL" "BE" "DE" "FR" "LU" "AT" "IE" "IT" "ES" "PT" "FI" "SE" "DK" "PL" "CZ" "SK" "HU" "RO" "BG" "HR" "SI" "EE" "LV" "LT" "GR" "CY" "MT"}) and not cf.client.bot
  ```

## Caveats

- **Traveling EU customers / VPN users** from the US or SG will see a one-time
  challenge (usually solved automatically, no CAPTCHA). Acceptable trade-off.
- The rule affects the **whole zone**. If you run US-based uptime monitors or
  third-party integrations, allowlist their IPs in a higher-priority rule first.
- Cloudflare geolocation is IP-based and ~99% accurate, not perfect.
