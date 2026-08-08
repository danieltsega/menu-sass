import Link from "next/link"
import {
  QrCode,
  Menu,
  Smartphone,
  Clock,
  Settings,
  TrendingUp,
  Send,
  Phone,
  MapPin,
  UtensilsCrossed,
  CheckCircle2,
  ArrowRight,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const features = [
  {
    icon: QrCode,
    title: "QR Menus",
    description:
      "Turn every table into a digital experience. Customers scan and browse your full menu instantly, no app download needed.",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description:
      "Every menu is beautifully optimized for phones, tablets, and desktops so it looks perfect on any screen.",
  },
  {
    icon: Clock,
    title: "Real-Time Updates",
    description:
      "Update prices, availability, and items in seconds. What you change is instantly reflected for your customers.",
  },
  {
    icon: Settings,
    title: "Easy Management",
    description:
      "A simple admin dashboard lets you manage categories, dishes, and your cafe info without any technical skills.",
  },
  {
    icon: TrendingUp,
    title: "More Orders",
    description:
      "Call-to-action buttons connect customers straight to you. Turn browsers into buyers with one tap.",
  },
  {
    icon: UtensilsCrossed,
    title: "Built for Cafes",
    description:
      "From cozy coffee shops to busy restaurants, our menus are tailored to the Ethiopian hospitality scene.",
  },
]

const steps = [
  {
    step: "01",
    title: "Get in touch",
    description:
      "Reach out to us on Telegram or phone and tell us about your cafe.",
  },
  {
    step: "02",
    title: "We set you up",
    description:
      "We create your digital menu with your logo, dishes, prices, and photos.",
  },
  {
    step: "03",
    title: "Go live",
    description:
      "Print your QR code, place it on your tables, and watch customers scan.",
  },
]

const team = [
  {
    name: "Yohannis Worku",
    role: "Founder & Developer",
    initials: "YW",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Menu className="size-4" />
            </span>
            MenuSass
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </Link>
            <Link href="#team" className="hover:text-foreground transition-colors">
              Our team
            </Link>
            <Link href="#contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm">
              <Link href="https://t.me/JoAhood" target="_blank" rel="noopener noreferrer">
                Get Started
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-6">
              <QrCode className="size-4" />
              Digital menus for Ethiopian cafes
            </div>
            <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Your cafe menu,
              <span className="text-primary"> digital</span> and{" "}
              <span className="text-primary">always up to date</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              MenuSass turns your cafe&apos;s menu into a beautiful, shareable digital experience.
              No printing costs, no outdated prices — just scan, browse, and order.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="https://t.me/JoAhood" target="_blank" rel="noopener noreferrer">
                  Get your menu <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/menu/dureti-coffee">View a live menu</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="border-t bg-card/50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                A complete digital menu solution designed for cafes and restaurants.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardContent className="p-6">
                    <div className="mb-4 grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="size-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Getting your cafe online takes less time than you think.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.step} className="relative rounded-xl border bg-card p-6">
                  <span className="text-4xl font-extrabold text-primary/20">{step.step}</span>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-16 grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to go digital?
              </h2>
              <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                Join the cafes already using MenuSass to share their menus. It&apos;s
                fast, affordable, and your customers will love it.
              </p>
              <ul className="mt-6 space-y-3">
                {["No printing costs", "Instant menu updates", "Works on any device"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-5 text-primary-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className="mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Link href="https://t.me/JoAhood" target="_blank" rel="noopener noreferrer">
                  Talk to us on Telegram <Send className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4">
              <div className="rounded-xl bg-primary-foreground/10 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="grid size-10 place-items-center rounded-full bg-primary-foreground/20">
                    <Smartphone className="size-5" />
                  </span>
                  <p className="font-semibold">Customer view</p>
                </div>
                <p className="text-sm text-primary-foreground/80">
                  Customers scan the QR code and instantly see your menu, prices, and photos —
                  beautifully laid out on their phone.
                </p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="grid size-10 place-items-center rounded-full bg-primary-foreground/20">
                    <Settings className="size-5" />
                  </span>
                  <p className="font-semibold">Owner view</p>
                </div>
                <p className="text-sm text-primary-foreground/80">
                  You manage everything from a simple dashboard. Edit dishes, update prices, and
                  add photos whenever you like.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="team" className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Meet the team</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                We&apos;re a small team passionate about helping local businesses go digital.
              </p>
            </div>
            <div className="flex justify-center">
              <Card className="w-full max-w-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <span className="grid size-16 place-items-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                    {team[0].initials}
                  </span>
                  <h3 className="mt-4 font-semibold text-lg">{team[0].name}</h3>
                  <p className="text-sm text-muted-foreground">{team[0].role}</p>
                  <a
                    href="https://t.me/JoAhood"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Send className="size-4" />
                    @JoAhood
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Menu className="size-4" />
              </span>
              MenuSass
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Digital menus for cafes and restaurants. Scan, browse, and order — the modern way
              to share your menu.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-foreground transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#team" className="hover:text-foreground transition-colors">
                  Our team
                </Link>
              </li>
              <li>
                <Link href="/menu/dureti-coffee" className="hover:text-foreground transition-colors">
                  View a live menu
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <span>
                  Lomi-Teams
                </span>
              </li>
              <li>
                <a
                  href="https://t.me/JoAhood"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Send className="size-4 text-primary" />
                  @JoAhood
                </a>
              </li>
              <li>
                <a
                  href="tel:+251912307517"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Phone className="size-4 text-primary" />
                  +2519 12307517
                </a>
              </li>
              {/* <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                <span>hello@menusass.com</span>
              </li> */}
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <span>Adama, Ethiopia</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MenuSass. Built by Lomi-Teams.
          </div>
        </div>
      </footer>
    </div>
  )
}
