import { EditorialHeading, Eyebrow } from "@/components/ui/Typography";

export function Intro() {
  return (
    <section
      id="intro"
      className="section-shell relative py-16 md:py-24"
      aria-labelledby="intro-heading"
    >
      <div className="relative overflow-hidden rounded-[2.4rem] bg-ivory-soft px-6 py-16 text-center md:px-16 md:py-24">
        <div
          className="glow-burgundy absolute -left-10 top-8 h-56 w-56 opacity-60 blur-2xl"
          aria-hidden
        />
        <div
          className="glow-burgundy absolute -right-8 bottom-6 h-44 w-44 opacity-40 blur-2xl"
          aria-hidden
        />

        <Eyebrow className="relative mb-6">ახალი დასაწყისი</Eyebrow>
        <EditorialHeading
          as="h2"
          id="intro-heading"
          className="relative mx-auto max-w-3xl text-[clamp(1.8rem,4.5vw,3.4rem)] leading-[1.15]"
        >
          ეს არ არის უბრალოდ დღე.
        </EditorialHeading>
        <p className="font-editorial relative mx-auto mt-5 max-w-xl text-lg text-burgundy md:text-2xl">
          ეს არის ყველაფერი, რაც აქამდე იყო და მარად იქნება.
        </p>
        <p className="font-ui relative mx-auto mt-8 max-w-lg text-sm leading-relaxed text-charcoal-soft md:text-base">
          „ზოგი დღე მთავრდება, ზოგიც კი ისტორიად რჩება.“ — ეს საიტი იმ
          ისტორიისთვისაა, რომელიც ჩვენ ერთად დავწერეთ.
        </p>
      </div>
    </section>
  );
}
