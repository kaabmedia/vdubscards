# Checkout redirect configuration

After payment, customers see Shopify's thank you page. To redirect them to your custom pages, configure Shopify Admin.

## Custom pages

| Page | URL | Use |
|------|-----|-----|
| Success | `/checkout/success` | Order confirmed, payment successful |
| Failed | `/checkout/failed` | Payment declined or failed |
| Cancelled | `/checkout/cancelled` | Customer left checkout without completing |

## Shopify Admin setup

### Success redirect (Order confirmation)

1. Go to **Shopify Admin** → **Settings** → **Checkout** → **Order processing**
2. Scroll to **Additional scripts**
3. Add:

```html
<script>
  (function() {
    // Redirect to custom thank you page after 2 seconds
    setTimeout(function() {
      window.location.href = "https://JOUW-DOMEIN.com/checkout/success";
    }, 2500);
  })();
</script>
```

Replace `JOUW-DOMEIN.com` with your actual domain (e.g. `vdubscards-2-0.vercel.app` or your custom domain).

### Failed / Cancelled

Shopify's checkout doesn't offer separate redirect URLs for failed or cancelled flows. Customers usually:
- **Failed**: See an error on the checkout page; they can retry or go back
- **Cancelled**: Return to the previous page (often the cart)

You can add a link to `/checkout/cancelled` on your cart page for users who abandoned checkout, or in your cart empty state.

## Direct links

You can link to these pages manually (e.g. from emails or support):

- Success: `https://yourdomain.com/checkout/success`
- Failed: `https://yourdomain.com/checkout/failed`
- Cancelled: `https://yourdomain.com/checkout/cancelled`
