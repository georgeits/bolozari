import Image from "next/image";
import { classStats, students } from "@/data/students";
import { EditorialHeading, Eyebrow } from "@/components/ui/Typography";

export function StudentsSection() {
  const [lead, second, third, ...rest] = students;

  return (
    <section
      id="class"
      className="section-shell py-10 md:py-16"
      aria-labelledby="class-heading"
    >
      <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>ჩვენი კლასი</Eyebrow>
          <EditorialHeading
            id="class-heading"
            className="mt-3 text-[clamp(2rem,5vw,3.6rem)]"
          >
            სახეები, რომლებიც დარჩება
          </EditorialHeading>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-charcoal-soft">
          არა კატალოგი — რედაქციული გვერდი. თითოეული სახე ერთი თავია ამ
          წლის წიგნში.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-5">
        <article className="col-span-12 overflow-hidden rounded-[2rem] md:col-span-7 md:row-span-2">
          <div className="relative aspect-[4/5] md:aspect-auto md:h-full md:min-h-[34rem]">
            <Image
              src={lead.photo}
              alt={lead.name}
              fill
              className="object-cover transition duration-700 hover:scale-[1.03]"
              sizes="(max-width:768px) 100vw, 58vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-6 text-white md:p-8">
              <p className="text-xs tracking-[0.18em] text-white/70">
                {lead.role ?? "მოსწავლე"}
              </p>
              <h3 className="font-editorial mt-1 text-3xl">{lead.name}</h3>
              <p className="mt-2 max-w-sm text-sm text-white/80">
                {lead.description}
              </p>
            </div>
          </div>
        </article>

        <aside className="col-span-12 flex flex-col justify-between gap-4 rounded-[2rem] bg-ivory-soft p-6 md:col-span-5 md:p-8">
          <div>
            <Eyebrow>რიცხვები</Eyebrow>
            <p className="font-editorial mt-4 text-2xl leading-snug text-charcoal md:text-3xl">
              ერთი კლასი — ბევრი ხმა, ერთი მეხსიერება.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-3">
            {classStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.4rem] border border-charcoal/8 bg-white/60 px-3 py-4 text-center"
              >
                <dt className="text-[0.65rem] tracking-[0.16em] text-burgundy-pale">
                  {stat.label}
                </dt>
                <dd className="font-editorial mt-2 text-2xl text-charcoal">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>

        {[second, third].map((student) => (
          <article
            key={student.id}
            className="col-span-6 overflow-hidden rounded-[1.8rem] md:col-span-5"
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={student.photo}
                alt={student.name}
                fill
                className="object-cover transition duration-700 hover:scale-[1.04]"
                sizes="(max-width:768px) 50vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 p-4 text-white">
                <h3 className="font-editorial text-xl">{student.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/75">
                  {student.favoriteMemory}
                </p>
              </div>
            </div>
          </article>
        ))}

        {rest.map((student, index) => (
          <article
            key={student.id}
            className={`col-span-6 overflow-hidden rounded-[1.8rem] md:col-span-4 ${
              index === rest.length - 1 ? "md:col-span-4" : ""
            }`}
          >
            <div className="relative aspect-[3/4]">
              <Image
                src={student.photo}
                alt={student.name}
                fill
                className="object-cover transition duration-700 hover:scale-[1.04]"
                sizes="(max-width:768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <div className="absolute bottom-0 p-4 text-white">
                <p className="text-[0.65rem] tracking-[0.14em] text-white/65">
                  {student.nickname}
                </p>
                <h3 className="font-editorial text-lg">{student.name}</h3>
                <p className="mt-1 text-xs text-white/70">{student.futureDream}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
