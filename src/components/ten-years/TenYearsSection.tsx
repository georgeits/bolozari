import Image from "next/image";
import { futureProfiles } from "@/data/future";
import { EditorialHeading, Eyebrow } from "@/components/ui/Typography";

export function TenYearsSection() {
  return (
    <section
      id="ten-years"
      className="section-shell py-16 md:py-24"
      aria-labelledby="ten-years-heading"
    >
      <div className="mb-10 max-w-2xl md:mb-14">
        <Eyebrow>მომავალი თავი</Eyebrow>
        <EditorialHeading
          id="ten-years-heading"
          className="mt-3 text-[clamp(2rem,5vw,3.5rem)]"
        >
          10 წლის შემდეგ
        </EditorialHeading>
        <p className="mt-4 text-sm leading-relaxed text-charcoal-soft md:text-base">
          წარმოსახვითი მომავალი — სადაც კლასი ისევ ერთმანეთს ეძებს, სხვა
          ქალაქებში და სხვა ოცნებებში.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {futureProfiles.map((profile, index) => {
          const large = index === 0 || index === 3;
          return (
            <article
              key={profile.id}
              className={`group relative overflow-hidden rounded-[2rem] ${
                large ? "md:col-span-7" : "md:col-span-5"
              }`}
            >
              <div className={`relative ${large ? "aspect-[16/11]" : "aspect-[4/5]"}`}>
                <Image
                  src={profile.photo}
                  alt={profile.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-[0.68rem] tracking-[0.18em] text-burgundy-dust">
                    {profile.profession} · {profile.city}
                  </p>
                  <h3 className="font-editorial mt-2 text-2xl text-white md:text-3xl">
                    {profile.name}
                  </h3>
                  <p className="font-editorial mt-3 max-w-md text-sm italic text-white/75 md:text-base">
                    „{profile.quote}“
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
