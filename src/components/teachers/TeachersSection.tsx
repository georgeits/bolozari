import Image from "next/image";
import { teachers } from "@/data/teachers";
import { EditorialHeading, Eyebrow } from "@/components/ui/Typography";

export function TeachersSection() {
  return (
    <section
      id="teachers"
      className="section-shell py-14 md:py-20"
      aria-labelledby="teachers-heading"
    >
      <div className="mb-10 max-w-2xl md:mb-14">
        <Eyebrow>მასწავლებლები</Eyebrow>
        <EditorialHeading
          id="teachers-heading"
          className="mt-3 text-[clamp(2rem,5vw,3.4rem)]"
        >
          ისინი, ვინც გზას გვიჩვენებდნენ
        </EditorialHeading>
        <p className="mt-4 text-sm leading-relaxed text-charcoal-soft md:text-base">
          არა სია — რედაქციული გვერდი იმ ადამიანებზე, რომლებმაც კლასს ხმა და
          მიმართულება მისცეს.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {teachers.map((teacher, index) => {
          const wide = index % 2 === 0;
          return (
            <article
              key={teacher.id}
              className={`overflow-hidden rounded-[2rem] bg-ivory-soft ${
                wide ? "md:col-span-7" : "md:col-span-5"
              }`}
            >
              <div
                className={`grid ${wide ? "md:grid-cols-[1.1fr_0.9fr]" : "md:grid-cols-1"}`}
              >
                <div className="relative aspect-[4/5] md:min-h-[22rem]">
                  <Image
                    src={teacher.photo}
                    alt={teacher.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 40vw"
                  />
                </div>
                <div className="flex flex-col justify-end p-6 md:p-8">
                  <p className="text-xs tracking-[0.16em] text-burgundy-pale">
                    {teacher.subject}
                  </p>
                  <h3 className="font-editorial mt-2 text-2xl md:text-3xl">
                    {teacher.name}
                  </h3>
                  <p className="font-editorial mt-4 text-base leading-relaxed text-charcoal-soft md:text-lg">
                    „{teacher.message}“
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
