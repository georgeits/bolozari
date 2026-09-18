import { GuestbookSection } from "@/components/guestbook/GuestbookSection";
import { RsvpSection } from "@/components/rsvp/RsvpSection";
import { EditorialHeading, Eyebrow } from "@/components/ui/Typography";

export function InvitationSection() {
  return (
    <section
      id="rsvp"
      className="relative overflow-hidden py-16 md:py-24"
      aria-labelledby="rsvp-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(90,40,50,0.3),transparent_52%),linear-gradient(180deg,#171113,#100c0d)]" />
      <div className="section-shell relative">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span
            className="mx-auto mb-5 block h-1.5 w-1.5 rounded-full bg-burgundy-pale"
            aria-hidden
          />
          <Eyebrow className="text-burgundy-dust">მოწვევა</Eyebrow>
          <EditorialHeading
            id="rsvp-heading"
            className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] text-ivory"
          >
            მოდიხარ?
          </EditorialHeading>
          <p className="mt-4 text-sm text-white/60">
            ერთი დადასტურება — და შენი ადგილი შენთვის შევინახეთ.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <RsvpSection />
          <GuestbookSection />
        </div>
      </div>
    </section>
  );
}
