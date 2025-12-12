import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ShoppingCart,
  Building2,
  Layers,
  FileText,
  Code2,
  Wrench,
  Globe,
  Palette,
  Check,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { SiWordpress } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const services = [
  {
    icon: ShoppingCart,
    title: "Magazine Online B2C",
    description: "Magazine online pentru vânzarea directă către consumatori. Design modern, integrare plăți și livrări.",
    features: ["Catalog produse", "Coș de cumpărături", "Plăți online", "Livrare integrată"],
  },
  {
    icon: Building2,
    title: "Magazine B2B",
    description: "Platforme dedicate relațiilor business-to-business cu funcționalități avansate de comandă și gestiune.",
    features: ["Prețuri personalizate", "Cont client B2B", "Comenzi recurente", "Facturare automată"],
  },
  {
    icon: Layers,
    title: "Hybrid B2C/B2B",
    description: "Soluții complete care combină avantajele ambelor modele de business într-o singură platformă.",
    features: ["Dual pricing", "Autentificare diferențiată", "Dashboard dedicat", "Rapoarte avansate"],
  },
  {
    icon: FileText,
    title: "Bloguri & Content",
    description: "Site-uri optimizate pentru conținut, SEO-friendly și ușor de administrat.",
    features: ["CMS intuitiv", "SEO optimizat", "Categorii & tag-uri", "Comentarii"],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Custom",
    description: "Soluții e-commerce personalizate pentru cerințe specifice de business.",
    features: ["Funcționalități unice", "Integrări custom", "Scalabilitate", "API personalizat"],
  },
  {
    icon: SiWordpress,
    title: "WooCommerce",
    description: "Magazine online bazate pe WordPress și WooCommerce, flexibile și ușor de gestionat.",
    features: ["Extensii premium", "Teme personalizate", "Plugin-uri custom", "Backup automat"],
  },
  {
    icon: Globe,
    title: "Site-uri Prezentare",
    description: "Site-uri de prezentare profesionale pentru afaceri, portofolii și servicii.",
    features: ["Design responsive", "Animații moderne", "Optimizare viteză", "Contact form"],
  },
  {
    icon: Code2,
    title: "Dezvoltare Custom",
    description: "Aplicații web personalizate dezvoltate de la zero conform specificațiilor.",
    features: ["Arhitectură modernă", "API development", "Integrări terțe", "Documentație"],
  },
  {
    icon: Wrench,
    title: "Mentenanță Lunară",
    description: "Servicii de mentenanță și suport pentru site-uri existente.",
    features: ["Actualizări", "Backup-uri", "Monitorizare", "Suport prioritar"],
  },
];

const pricingPlans = [
  {
    name: "Site Prezentare",
    price: "299",
    currency: "EUR",
    period: "",
    description: "Perfect pentru afaceri mici și prezențe online simple",
    features: [
      "Până la 5 pagini",
      "Design responsive",
      "Formular de contact",
      "Optimizare SEO de bază",
      "Hosting primul an inclus",
    ],
    popular: false,
  },
  {
    name: "E-commerce Start",
    price: "599",
    currency: "EUR",
    period: "",
    description: "Ideal pentru primul tău magazin online",
    features: [
      "Până la 100 produse",
      "Integrare plăți",
      "Design personalizat",
      "Gestiune comenzi",
      "Training utilizare",
    ],
    popular: false,
  },
  {
    name: "E-commerce Pro",
    price: "999",
    currency: "EUR",
    period: "",
    description: "Pentru magazine online cu cerințe avansate",
    features: [
      "Produse nelimitate",
      "Multiple gateway-uri plată",
      "Integrări ERP/CRM",
      "Rapoarte avansate",
      "Suport 3 luni inclus",
    ],
    popular: true,
  },
  {
    name: "Dezvoltare Custom",
    price: "1.499",
    currency: "EUR",
    period: "+",
    description: "Soluții personalizate pentru cerințe specifice",
    features: [
      "Analiză cerințe",
      "Arhitectură dedicată",
      "Funcționalități unice",
      "API custom",
      "Documentație completă",
    ],
    popular: false,
  },
];

const maintenancePlans = [
  {
    name: "Bronze",
    price: "49",
    currency: "EUR",
    period: "/lună",
    features: ["2 ore suport", "Backup lunar", "Actualizări securitate", "Monitorizare uptime"],
  },
  {
    name: "Silver",
    price: "99",
    currency: "EUR",
    period: "/lună",
    features: ["5 ore suport", "Backup săptămânal", "Actualizări complete", "Rapoarte lunare", "Optimizări viteză"],
    popular: true,
  },
  {
    name: "Gold",
    price: "199",
    currency: "EUR",
    period: "/lună",
    features: ["10 ore suport", "Backup zilnic", "Suport prioritar", "Modificări minore incluse", "Consultanță SEO"],
  },
];

const processSteps = [
  { number: "01", title: "Consultare", description: "Discutăm despre nevoile și obiectivele proiectului tău" },
  { number: "02", title: "Planificare", description: "Creăm un plan detaliat și un timeline realist" },
  { number: "03", title: "Dezvoltare", description: "Construim site-ul conform specificațiilor" },
  { number: "04", title: "Testing", description: "Testăm funcționalitatea pe toate dispozitivele" },
  { number: "05", title: "Lansare", description: "Publicăm site-ul și asigurăm tranziția" },
  { number: "06", title: "Mentenanță", description: "Oferim suport continuu post-lansare" },
];

const serviceOptions = [
  { value: "prezentare", label: "Site Prezentare" },
  { value: "ecommerce-start", label: "E-commerce Start" },
  { value: "ecommerce-pro", label: "E-commerce Pro" },
  { value: "b2b", label: "Magazine B2B" },
  { value: "woocommerce", label: "WooCommerce" },
  { value: "custom", label: "Dezvoltare Custom" },
  { value: "mentenanta", label: "Mentenanță Lunară" },
  { value: "altele", label: "Altele" },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Mesaj trimis cu succes!",
        description: "Vă vom contacta în cel mai scurt timp posibil.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "A apărut o eroare. Vă rugăm încercați din nou.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    contactMutation.mutate(data);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <Code2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl" data-testid="text-brand">AGC Web</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection("servicii")}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-servicii"
              >
                Servicii
              </button>
              <button
                onClick={() => scrollToSection("preturi")}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-preturi"
              >
                Prețuri
              </button>
              <button
                onClick={() => scrollToSection("despre")}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-despre"
              >
                Despre
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-contact"
              >
                Contact
              </button>
            </nav>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:flex">
                100+ Proiecte Livrate
              </Badge>
              <ThemeToggle />
              <Button
                onClick={() => scrollToSection("contact")}
                className="hidden sm:inline-flex"
                data-testid="button-cta-header"
              >
                Solicită Ofertă
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <nav className="flex flex-col p-4 gap-2">
              <button
                onClick={() => scrollToSection("servicii")}
                className="text-left p-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-servicii-mobile"
              >
                Servicii
              </button>
              <button
                onClick={() => scrollToSection("preturi")}
                className="text-left p-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-preturi-mobile"
              >
                Prețuri
              </button>
              <button
                onClick={() => scrollToSection("despre")}
                className="text-left p-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-despre-mobile"
              >
                Despre
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left p-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-contact-mobile"
              >
                Contact
              </button>
              <Button
                onClick={() => scrollToSection("contact")}
                className="mt-2"
                data-testid="button-cta-mobile"
              >
                Solicită Ofertă
              </Button>
            </nav>
          </motion.div>
        )}
      </header>

      <main>
        {/* Hero Section with Visual Background */}
        <section className="relative overflow-hidden min-h-[80vh] flex items-center">
          {/* Abstract Background with Dark Wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Abstract Grid Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                backgroundSize: '60px 60px'
              }} />
            </div>
            {/* Gradient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/40" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
                Web Development Professional
              </Badge>
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
                Soluții Web Profesionale
                <span className="block text-primary mt-2">Pentru Afacerea Ta</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Creăm magazine online, platforme e-commerce, site-uri de prezentare și aplicații web custom.
                Transformăm ideile în realitate digitală.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => scrollToSection("servicii")}
                  className="text-base"
                  data-testid="button-vezi-servicii"
                >
                  Vezi Servicii
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("contact")}
                  className="text-base bg-white/10 text-white border-white/30 hover:bg-white/20"
                  data-testid="button-contacteaza-hero"
                >
                  Contactează-ne
                </Button>
              </div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-4 sm:gap-8 text-slate-300"
            >
              <div className="flex items-center gap-2" data-testid="text-trust-projects">
                <Check className="w-5 h-5 text-primary" />
                <span className="text-sm sm:text-base">100+ Proiecte Finalizate</span>
              </div>
              <div className="flex items-center gap-2" data-testid="text-trust-clients">
                <Check className="w-5 h-5 text-primary" />
                <span className="text-sm sm:text-base">Clienți Mulțumiți</span>
              </div>
              <div className="flex items-center gap-2" data-testid="text-trust-support">
                <Check className="w-5 h-5 text-primary" />
                <span className="text-sm sm:text-base">Suport Post-Lansare</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicii" className="py-12 sm:py-16 lg:py-28 bg-card/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <Badge variant="secondary" className="mb-4">Servicii</Badge>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Ce Putem Face Pentru Tine
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                Oferim o gamă completă de servicii de dezvoltare web, de la site-uri simple de prezentare
                până la platforme complexe de e-commerce.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {services.map((service, index) => (
                <motion.div key={service.title} variants={fadeInUp}>
                  <Card className="h-full hover-elevate transition-all duration-300" data-testid={`card-service-${index}`}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <service.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="font-heading">{service.title}</CardTitle>
                      <CardDescription className="text-base">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="preturi" className="py-12 sm:py-16 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <Badge variant="secondary" className="mb-4">Prețuri</Badge>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Prețuri Orientative
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                Prețurile sunt orientative și pot varia în funcție de cerințele specifice ale proiectului.
                Contactează-ne pentru o ofertă personalizată.
              </p>
            </motion.div>

            {/* Main pricing */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16"
            >
              {pricingPlans.map((plan, index) => (
                <motion.div key={plan.name} variants={fadeInUp}>
                  <Card
                    className={`h-full relative ${plan.popular ? "border-primary" : ""}`}
                    data-testid={`card-pricing-${index}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge>Recomandat</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="font-heading text-lg sm:text-xl">{plan.name}</CardTitle>
                      <div className="mt-3 sm:mt-4">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading">De la {plan.price}</span>
                        <span className="text-muted-foreground ml-1 text-sm">{plan.currency}{plan.period}</span>
                      </div>
                      <CardDescription className="mt-2 text-sm">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full mt-6"
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => scrollToSection("contact")}
                        data-testid={`button-pricing-${index}`}
                      >
                        Solicită Ofertă
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Maintenance pricing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-6 sm:mb-8"
            >
              <h3 className="font-heading text-xl sm:text-2xl font-bold mb-2">Pachete Mentenanță Lunară</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Suport continuu pentru site-ul tău</p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto"
            >
              {maintenancePlans.map((plan, index) => (
                <motion.div key={plan.name} variants={fadeInUp}>
                  <Card
                    className={`h-full ${plan.popular ? "border-primary" : ""}`}
                    data-testid={`card-maintenance-${index}`}
                  >
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="font-heading">{plan.name}</CardTitle>
                      <div className="mt-2">
                        <span className="text-3xl font-bold font-heading">{plan.price}</span>
                        <span className="text-muted-foreground ml-1">{plan.currency}{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              * Prețurile sunt orientative și pot varia în funcție de complexitatea și cerințele specifice ale proiectului.
            </p>
          </div>
        </section>

        {/* Process Section */}
        <section id="despre" className="py-12 sm:py-16 lg:py-28 bg-card/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <Badge variant="secondary" className="mb-4">Despre Noi</Badge>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Procesul Nostru de Lucru
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                La AGC Web, urmăm un proces structurat pentru a asigura succesul fiecărui proiect.
                Transparență și comunicare constantă sunt prioritățile noastre.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {processSteps.map((step, index) => (
                <motion.div key={step.number} variants={fadeInUp}>
                  <Card className="h-full" data-testid={`card-process-${index}`}>
                    <CardHeader>
                      <div className="text-5xl font-heading font-bold text-primary/20 mb-2">
                        {step.number}
                      </div>
                      <CardTitle className="font-heading">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* About AGC Web */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 sm:mt-16 lg:mt-20"
            >
              <Card className="overflow-hidden" data-testid="card-about-agc">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                  <div className="p-6 sm:p-8 lg:p-12">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold mb-3 sm:mb-4">De Ce AGC Web?</h3>
                    <p className="text-muted-foreground mb-6">
                      Suntem la început de drum, dar aducem pasiune și dedicare în fiecare proiect.
                      Ne concentrăm pe calitate, transparență și pe satisfacția clienților noștri.
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Palette className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Design Modern</h4>
                          <p className="text-sm text-muted-foreground">Site-uri cu aspect profesional și actual</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Code2 className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Cod Calitativ</h4>
                          <p className="text-sm text-muted-foreground">Tehnologii moderne și best practices</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Wrench className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Suport Continuu</h4>
                          <p className="text-sm text-muted-foreground">Mentenanță și asistență post-lansare</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-8 lg:p-12 flex items-center justify-center">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-primary mx-auto mb-6">
                        <Code2 className="w-12 h-12 text-primary-foreground" />
                      </div>
                      <h3 className="font-heading text-3xl font-bold mb-2">AGC Web</h3>
                      <p className="text-muted-foreground">Web Development Professional</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 sm:py-16 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <Badge variant="secondary" className="mb-4">Contact</Badge>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Hai Să Discutăm
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                Ai un proiect în minte? Completează formularul sau contactează-ne direct.
                Răspundem în maxim 24 de ore.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-6 lg:gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-3"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Trimite un mesaj</CardTitle>
                    <CardDescription>Completează formularul și te vom contacta cât mai curând.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nume *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ion Popescu" {...field} data-testid="input-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="email@exemplu.ro" {...field} data-testid="input-email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefon</FormLabel>
                                <FormControl>
                                  <Input placeholder="+40 712 345 678" {...field} value={field.value ?? ""} data-testid="input-phone" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="service"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Serviciu dorit *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-service">
                                      <SelectValue placeholder="Alege un serviciu" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {serviceOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mesaj *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descrie pe scurt proiectul tău..."
                                  className="min-h-[120px] resize-none"
                                  {...field}
                                  data-testid="input-message"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full sm:w-auto"
                          disabled={contactMutation.isPending}
                          data-testid="button-submit-contact"
                        >
                          {contactMutation.isPending ? (
                            <>Se trimite...</>
                          ) : (
                            <>
                              Trimite Mesaj
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-2 space-y-6"
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Email</h4>
                        <a
                          href="mailto:agcweb@outlook.com"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          data-testid="link-email"
                        >
                          agcweb@outlook.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Telefon</h4>
                        <a
                          href="tel:+40723430056"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          data-testid="link-phone"
                        >
                          0723 430 056
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Program</h4>
                        <p className="text-muted-foreground">
                          Luni - Vineri: 09:00 - 18:00
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <a href="tel:+40723430056" data-testid="button-call">
                    <Phone className="mr-2 h-4 w-4" />
                    Sună Acum
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                  <Code2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-xl">AGC Web</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Soluții web profesionale pentru afacerea ta. De la site-uri de prezentare
                la platforme complexe de e-commerce.
              </p>
              <div className="flex gap-4">
                <Badge variant="secondary">Calitate</Badge>
                <Badge variant="secondary">Transparență</Badge>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Servicii</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection("servicii")} className="hover:text-foreground transition-colors" data-testid="footer-link-magazine">Magazine Online</button></li>
                <li><button onClick={() => scrollToSection("servicii")} className="hover:text-foreground transition-colors" data-testid="footer-link-ecommerce">E-commerce</button></li>
                <li><button onClick={() => scrollToSection("servicii")} className="hover:text-foreground transition-colors" data-testid="footer-link-prezentare">Site Prezentare</button></li>
                <li><button onClick={() => scrollToSection("servicii")} className="hover:text-foreground transition-colors" data-testid="footer-link-custom">Dezvoltare Custom</button></li>
                <li><button onClick={() => scrollToSection("servicii")} className="hover:text-foreground transition-colors" data-testid="footer-link-mentenanta">Mentenanță</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="mailto:agcweb@outlook.com" className="hover:text-foreground transition-colors" data-testid="footer-link-email">
                    agcweb@outlook.com
                  </a>
                </li>
                <li>
                  <a href="tel:+40723430056" className="hover:text-foreground transition-colors" data-testid="footer-link-phone">
                    0723 430 056
                  </a>
                </li>
                <li data-testid="footer-text-program">Luni - Vineri: 09:00 - 18:00</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground" data-testid="footer-copyright">
              &copy; {new Date().getFullYear()} AGC Web. Toate drepturile rezervate.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <button onClick={() => scrollToSection("servicii")} className="hover:text-foreground transition-colors" data-testid="footer-nav-servicii">
                Servicii
              </button>
              <button onClick={() => scrollToSection("preturi")} className="hover:text-foreground transition-colors" data-testid="footer-nav-preturi">
                Prețuri
              </button>
              <button onClick={() => scrollToSection("contact")} className="hover:text-foreground transition-colors" data-testid="footer-nav-contact">
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
