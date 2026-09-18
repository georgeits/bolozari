import { ArchiveSection } from "@/components/archive/ArchiveSection";
import { CollageWallSection } from "@/components/collage/CollageWallSection";
import { FinalScene } from "@/components/final/FinalScene";
import { FutureLetterSection } from "@/components/future-letter/FutureLetterSection";
import { Hero } from "@/components/hero/Hero";
import { Intro } from "@/components/intro/Intro";
import { PhotoboothSection } from "@/components/photobooth/PhotoboothSection";
import { InvitationSection } from "@/components/rsvp/InvitationSection";
import { StudentsSection } from "@/components/students/StudentsSection";
import { TeachersSection } from "@/components/teachers/TeachersSection";
import { WhiteShirtSection } from "@/components/white-shirt/WhiteShirtSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <StudentsSection />
      <ArchiveSection />
      <TeachersSection />
      <PhotoboothSection />
      <CollageWallSection />
      <WhiteShirtSection />
      <FutureLetterSection />
      <InvitationSection />
      <FinalScene />
    </>
  );
}
