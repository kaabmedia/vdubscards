import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist | V-Dub's Cards",
  robots: { index: false, follow: false },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
