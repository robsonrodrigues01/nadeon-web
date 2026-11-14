import type { Address } from "@/lib/contracts/account";
import { Button } from "@/components/ui/button";

export interface AddressListProps {
  addresses: Address[];
}

function countryName(code: string): string {
  return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
}

function cityLine(address: Address): string {
  const region = [address.province, address.zip].filter(Boolean).join(" ");
  return [address.city, region, countryName(address.country)]
    .filter(Boolean)
    .join(", ");
}

export function AddressList({ addresses }: AddressListProps) {
  return (
    <section
      id="addresses"
      aria-labelledby="addresses-heading"
      className="scroll-mt-24 rounded-card border border-border bg-bg-elevated p-6 sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="addresses-heading"
          className="text-xs font-bold uppercase tracking-[0.12em] text-accent"
        >
          Addresses
        </h2>
        <Button variant="secondary" size="sm" disabled>
          + Add address
        </Button>
      </div>

      <ul className="mt-4 grid gap-3.5 sm:grid-cols-2">
        {addresses.map((address) => (
          <li
            key={address.id}
            className={`flex flex-col rounded-card border p-5 ${
              address.isDefault
                ? "border-accent/60 bg-accent/10"
                : "border-border"
            }`}
          >
            <div className="flex min-h-11 items-center justify-between gap-3">
              {address.isDefault ? (
                <span className="text-xs font-extrabold tracking-[0.08em] text-accent">
                  DEFAULT
                </span>
              ) : (
                <Button variant="link" size="sm" disabled>
                  Set as default
                </Button>
              )}
            </div>

            <address className="mt-2 text-sm not-italic leading-relaxed text-fg/85">
              <span className="block">
                {address.firstName} {address.lastName}
              </span>
              <span className="block">{address.address1}</span>
              {address.address2 ? (
                <span className="block">{address.address2}</span>
              ) : null}
              <span className="block">{cityLine(address)}</span>
            </address>

            <div className="mt-3 flex gap-4">
              <Button variant="link" size="sm" disabled>
                Edit
              </Button>
              <Button variant="link" size="sm" disabled>
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm text-fg/60">
        Changing your default address also updates where active subscriptions
        ship.
      </p>
    </section>
  );
}
