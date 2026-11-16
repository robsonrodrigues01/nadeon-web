import type React from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { CustomerProfile } from "@/lib/contracts/account";
import { AccountSidebar } from "./account-sidebar";

export interface AccountOrdersShellProps {
  customer: CustomerProfile | null;
  currentPath: string;
  children: React.ReactNode;
}

/** Store chrome plus the account sidebar; stacks on mobile and sits beside content from lg. */
export function AccountOrdersShell({
  customer,
  currentPath,
  children,
}: AccountOrdersShellProps) {
  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 md:px-8 md:py-12 lg:flex-row lg:gap-10 lg:px-12">
          <AccountSidebar customer={customer} currentPath={currentPath} />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>

      <Footer line="human" />
    </>
  );
}
