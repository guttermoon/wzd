import { Mail, Phone, MapPin } from "lucide-react"
import { Reveal } from "@/components/fx/reveal"
import { ContactForm } from "@/components/contact-form"
import { getSectionContent } from "@/lib/notion-content"

export const metadata = {
  title: "Letters to the Editor | The Dead Good Club",
  description:
    "Write to The Dead Good Club — questions, pitches, partnerships, and plain old letters all welcome.",
}

export const revalidate = 60

const contactInfo = [
  {
    icon: Mail,
    title: "Post",
    content: "hello@deadgood.club",
    description: "Answered within 24 hours",
  },
  {
    icon: Phone,
    title: "Wire",
    content: "+1 (555) 123-4567",
    description: "Mon–Fri, 9am–6pm",
  },
  {
    icon: MapPin,
    title: "Call round",
    content: "123 Innovation Street, Tech City",
    description: "By appointment only",
  },
]

const quickAnswers = [
  ["Response time?", "All letters answered within 24 hours."],
  ["Guest dispatches?", "Yes — send your pitch, we read everything."],
  ["Partnerships?", "Open to a dead good one. Let's talk."],
  ["Press enquiries?", "Media kit and interviews on request."],
]

export default async function ContactPage() {
  const content = await getSectionContent("contact-info")

  return (
    <div className="min-h-screen overflow-x-clip">
      {/* Page header */}
      <section className="border-b border-ink/80">
        <div className="container py-14 md:py-20">
          <Reveal effect="fade">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60">
              Correspondence department
            </p>
          </Reveal>
          <Reveal effect="settle" delay={80}>
            <h1 className="mt-2 font-display uppercase leading-[0.95] text-ink">
              <span
                className="overprint text-[clamp(2.5rem,8vw,5.5rem)]"
                data-text="Letters to"
              >
                Letters to
              </span>
              <br />
              <span
                className="overprint text-[clamp(2.5rem,8vw,5.5rem)]"
                data-text="the Editor"
              >
                the Editor
              </span>
            </h1>
          </Reveal>
          <Reveal effect="fade" delay={200}>
            {content?.html ? (
              <div
                className="mt-6 max-w-2xl font-serif text-lg italic text-ink/75 [&_p]:my-1"
                dangerouslySetInnerHTML={{ __html: content.html }}
              />
            ) : (
              <p className="mt-6 max-w-2xl font-serif text-lg italic text-ink/75">
                Have a question? Want to collaborate? Ready to share your story?{" "}
                <span className="highlight">The mailbag is always open.</span>
              </p>
            )}
          </Reveal>
        </div>
      </section>

      <div className="container py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Letter form as a coupon */}
          <Reveal effect="settle" rotate={-0.6} className="lg:col-span-2">
            <div
              className="coupon paper p-6 sm:p-8"
              style={{ "--clip-rot": "-0.6deg" } as React.CSSProperties}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-press-red">
                Form L-1 — letter to the editor
              </p>
              <h2 className="mt-2 font-display text-2xl uppercase text-ink sm:text-3xl">
                Compose your letter
              </h2>
              <div className="rule-double mt-4 mb-6" />
              <ContactForm />
            </div>
          </Reveal>

          {/* Contact info clippings */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Reveal
                key={info.title}
                effect="settle"
                delay={index * 120}
                rotate={index % 2 === 0 ? 1 : -1}
              >
                <div
                  className="clipping tape-right tape p-5"
                  style={{ "--clip-rot": `${index % 2 === 0 ? 1 : -1}deg` } as React.CSSProperties}
                >
                  <div className="flex items-start gap-4">
                    <info.icon className="mt-1 h-6 w-6 shrink-0 text-press-red" />
                    <div>
                      <h3 className="font-display text-lg uppercase text-ink">
                        {info.title}
                      </h3>
                      <p className="mt-1 font-mono text-sm text-ink">{info.content}</p>
                      <p className="mt-1 font-serif text-sm italic text-ink/60">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal effect="settle" delay={380} rotate={0.8}>
              <div
                className="clipping bg-paper-2 p-5"
                style={{ "--clip-rot": "0.8deg" } as React.CSSProperties}
              >
                <h3 className="font-display text-lg uppercase text-ink">
                  Quick answers
                </h3>
                <div className="rule mt-2" />
                <dl className="mt-3 space-y-3">
                  {quickAnswers.map(([q, a]) => (
                    <div key={q}>
                      <dt className="font-mono text-xs uppercase tracking-[0.14em] text-ink">
                        {q}
                      </dt>
                      <dd className="mt-0.5 font-serif text-sm italic text-ink/70">
                        {a}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}
