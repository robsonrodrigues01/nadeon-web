import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Claim } from "@/components/commerce/product-card/claim";
import { TrustStrip } from "@/components/brand/trust-strip";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { contentProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { CourseRegistrationForm } from "./_components/course-registration-form";

type CoursePageProps = {
  params: Promise<{ curso: string }>;
};

async function getCourse(slug: string) {
  return contentProvider.getCourse(slug);
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { curso } = await params;
  const course = await getCourse(curso);
  if (!course) notFound();
  return buildMetadata({
    title: course.title,
    description: "To be confirmed",
    pathname: `/courses/${course.slug}`,
  });
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { curso } = await params;
  const course = await getCourse(curso);
  if (!course) notFound();

  const isPet = course.audience === "pet";
  const line = isPet ? "pet" : "human";

  return (
    <div data-theme={line} className="flex min-h-full flex-1 flex-col">
      <AnnouncementBar line={line} />
      <Header variant={line} />
      <main id="main-content" tabIndex={-1} className="flex-1 bg-bg text-fg">
        <section className="border-b border-border px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.75fr)] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">
                Free email course
              </p>
              <h1 className="mt-3 font-archivo text-4xl font-extrabold sm:text-6xl">
                {course.title}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
                {isPet ? (
                  <Claim showDisclaimer>{course.description}</Claim>
                ) : (
                  course.description
                )}
              </p>
              <p className="mt-5 text-sm font-semibold">
                Free · {course.lessons.length} emails · every{" "}
                {course.cadenceDays} days
              </p>
            </div>
            <section
              aria-labelledby="course-signup-title"
              className="rounded-2xl border border-border bg-bg-elevated p-6 sm:p-8"
            >
              <h2
                id="course-signup-title"
                className="mb-6 font-archivo text-2xl font-bold"
              >
                Send me the free course
              </h2>
              <CourseRegistrationForm
                courseSlug={course.slug}
                audience={course.audience}
              />
            </section>
          </div>
        </section>

        <section
          aria-labelledby="course-lessons-title"
          className="px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
        >
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              {course.lessons.length} lessons · every {course.cadenceDays} days
            </p>
            <h2
              id="course-lessons-title"
              className="mt-3 font-archivo text-3xl font-extrabold uppercase sm:text-5xl"
            >
              What you&apos;ll learn
            </h2>
            <ol className="mt-8 grid gap-4 md:grid-cols-2">
              {course.lessons.map((lesson, index) => {
                const isClaim = lesson.summary.endsWith("*");
                return (
                  <li
                    key={`${lesson.day}-${lesson.title}`}
                    className="rounded-2xl border border-border bg-bg-elevated p-6"
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-accent">
                      Day {lesson.day} · Lesson {index + 1}
                    </p>
                    <h3 className="mt-2 font-archivo text-xl font-bold">
                      {lesson.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                      {isPet || isClaim ? (
                        <Claim showDisclaimer={isClaim}>{lesson.summary}</Claim>
                      ) : (
                        lesson.summary
                      )}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section
          aria-labelledby="course-instructor-title"
          className="border-t border-border bg-bg-elevated px-5 py-12 sm:px-8 lg:px-12"
        >
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              Your instructor
            </p>
            <h2
              id="course-instructor-title"
              className="mt-3 font-archivo text-2xl font-bold"
            >
              {course.instructor.name}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
              {course.instructor.bio}
            </p>
          </div>
        </section>
        {isPet && (
          <p
            role="note"
            className="px-5 py-6 text-center text-xs text-fg-muted"
          >
            For animal use only.
          </p>
        )}
      </main>
      <TrustStrip line={line} />
      <Footer line={line} />
    </div>
  );
}
