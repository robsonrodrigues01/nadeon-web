import { Button } from "@/components/ui/button";

export function DeleteAccount() {
  return (
    <section
      aria-labelledby="delete-account-heading"
      className="flex flex-col gap-4 rounded-card border border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7"
    >
      <div>
        <h2 id="delete-account-heading" className="font-bold text-fg">
          Delete account
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-fg/70">
          Cancels active subscriptions and permanently removes your profile and
          addresses. Order records we must keep by law are retained.
        </p>
      </div>
      <Button variant="link" disabled className="shrink-0">
        Request account deletion
      </Button>
    </section>
  );
}
