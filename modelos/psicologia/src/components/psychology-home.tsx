"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import {
  AuroraScrollStack,
  AuroraScrollStackItem,
} from "@/components/ui/aurora-scroll-stack";
import { AboutStory } from "@/components/ui/about-story";
import { RecognitionOrbit } from "@/components/ui/recognition-orbit";
import { RecognitionReveal } from "@/components/ui/recognition-reveal";
import {
  ArrowRight,
  ArrowLeft,
  Car,
  CircleCheckBig,
  ChevronDown,
  LockKeyhole,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { lead, asset } from "@/lead";

const services = [
  {
    title: "Individual",
    description: "Para entender emoções, padrões e escolhas com mais clareza e gentileza.",
    image: "/illustrations/therapy-individual.svg",
    alt: "Ilustração vetorial sobre psicoterapia individual",
  },
  {
    title: "Casais",
    description: "Um espaço para escutar, ser escutado e reconstruir formas de se relacionar.",
    image: "/illustrations/therapy-couples.svg",
    alt: "Ilustração vetorial sobre terapia de casal",
  },
  {
    title: "Online",
    description: "A mesma presença e o mesmo cuidado, com privacidade, onde você estiver.",
    image: "/illustrations/therapy-online.svg",
    alt: "Ilustração vetorial sobre atendimento psicológico online",
  },
];

const recognition = [
  {
    title: "A mente não desacelera",
    description: "Pensamentos, cobranças e preocupações parecem ocupar espaço demais.",
    image: "/images/recognition-mind.png",
    alt: "Mulher pensativa junto à janela no fim do dia",
  },
  {
    title: "Você tem carregado tudo só",
    description: "Mesmo cercado de pessoas, pode ser difícil dividir o que está sentindo.",
    image: "/images/recognition-alone.png",
    alt: "Homem sentado em silêncio em um ambiente acolhedor",
  },
  {
    title: "Uma relação precisa de cuidado",
    description: "O diálogo se perdeu, os conflitos se repetem ou a distância aumentou.",
    image: "/images/recognition-relationship.png",
    alt: "Casal em um momento de silêncio à mesa",
  },
  {
    title: "Algo em você pede mudança",
    description: "Nem sempre há uma crise. Às vezes, existe apenas a vontade de viver com mais sentido.",
    image: "/images/recognition-change.png",
    alt: "Mulher observando a luz da manhã perto de uma janela",
  },
];

const process = [
  {
    title: "Fale conosco",
    description: "Agende uma conversa inicial para entendermos sua demanda.",
  },
  {
    title: "Avaliação e alinhamento",
    description: "Alinhamos expectativas e definimos o melhor caminho para você.",
  },
  {
    title: "Início do acompanhamento",
    description: "Começamos seu processo com acolhimento e propósito.",
  },
];

const questions = [
  ["Como sei se a psicoterapia é para mim?", "A conversa inicial ajuda a compreender sua necessidade e se este é o momento adequado para iniciar."],
  ["Quanto tempo dura o processo?", "A duração é singular e combinada ao longo do acompanhamento, respeitando seus objetivos e seu ritmo."],
  ["As sessões são online ou presenciais?", "Confirme no primeiro contato quais modalidades estão disponíveis."],
  ["O atendimento é sigiloso?", "Sim. O sigilo profissional é um princípio fundamental do atendimento psicológico."],
];

type BookingStep = "message" | "calendar" | "done";

type AvailableDay = {
  iso: string;
  weekday: string;
  day: string;
  month: string;
  full: string;
};

function buildAvailableDays(): AvailableDay[] {
  const days: AvailableDay[] = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);

  while (days.length < 12) {
    cursor.setDate(cursor.getDate() + 1);
    if (cursor.getDay() === 0) continue;

    const iso = [
      cursor.getFullYear(),
      String(cursor.getMonth() + 1).padStart(2, "0"),
      String(cursor.getDate()).padStart(2, "0"),
    ].join("-");

    days.push({
      iso,
      weekday: new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(cursor).replace(".", ""),
      day: String(cursor.getDate()).padStart(2, "0"),
      month: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(cursor).replace(".", ""),
      full: new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(cursor),
    });
  }

  return days;
}

function BookingFlow() {
  const [step, setStep] = useState<BookingStep>("message");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [availableDays] = useState<AvailableDay[]>(buildAvailableDays);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const reduceMotion = useReducedMotion();

  const panelMotion = reduceMotion
    ? { initial: false as const }
    : {
        initial: { opacity: 0, x: 28 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -28 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
      };

  function goToCalendar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStep("calendar");
  }

  function finishBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedDate || !selectedTime) return;
    setStep("done");
  }

  const selectedDay = availableDays.find((day) => day.iso === selectedDate);

  return (
    <motion.section
      className="v3-booking"
      id="agendamento"
      aria-labelledby="booking-title"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.52, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="v3-shell v3-booking__card" layout>
        <motion.div
          className="v3-booking__intro"
          initial={reduceMotion ? false : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.5, delay: 0.08 }}
        >
          <span className="v3-kicker">Vamos conversar</span>
          <h2 id="booking-title">Conte apenas o que for possível agora.</h2>
          <p>Depois da sua mensagem, você poderá escolher um dia para uma conversa inicial.</p>
          <div className="v3-booking__steps" aria-label="Etapas do agendamento">
            <span className={step === "message" ? "is-active" : "is-complete"}><i>1</i> Mensagem</span>
            <b aria-hidden="true" />
            <span className={step === "calendar" ? "is-active" : step === "done" ? "is-complete" : ""}><i>2</i> Agenda</span>
          </div>
        </motion.div>

        <motion.div className="v3-booking__panel" layout aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {step === "message" && (
              <motion.form key="message" {...panelMotion} onSubmit={goToCalendar}>
                <div className="v3-field-row">
                  <label className="v3-field">
                    <span>Como podemos chamar você?</span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Seu nome"
                      required
                    />
                  </label>
                  <label className="v3-field">
                    <span>E-mail ou WhatsApp</span>
                    <input
                      type="text"
                      name="contact"
                      autoComplete="email"
                      value={contact}
                      onChange={(event) => setContact(event.target.value)}
                      placeholder="Como prefere receber o retorno?"
                      required
                    />
                  </label>
                </div>
                <label className="v3-field">
                  <span>O que você gostaria de conversar?</span>
                  <textarea
                    name="message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Escreva com suas palavras. Não precisa saber explicar tudo agora."
                    rows={5}
                    required
                  />
                </label>
                <div className="v3-booking__actions">
                  <small>Seus dados são usados apenas para responder a este contato.</small>
                  <button className="v3-button" type="submit">
                    Ver dias disponíveis <ArrowRight aria-hidden="true" />
                  </button>
                </div>
              </motion.form>
            )}

            {step === "calendar" && (
              <motion.form key="calendar" {...panelMotion} onSubmit={finishBooking}>
                <div className="v3-calendar__heading">
                  <div>
                    <span className="v3-kicker">Próxima etapa</span>
                    <h3>Qual dia funciona melhor?</h3>
                    <p>Escolha uma preferência. A disponibilidade é confirmada no retorno.</p>
                  </div>
                  <button className="v3-back-button" type="button" onClick={() => setStep("message")}>
                    <ArrowLeft aria-hidden="true" /> Editar mensagem
                  </button>
                </div>
                <div className="v3-calendar" aria-label="Dias disponíveis">
                  {availableDays.length === 0 ? (
                    <p className="v3-calendar__loading">Carregando os próximos dias…</p>
                  ) : (
                    availableDays.map((day) => (
                      <button
                        key={day.iso}
                        className={selectedDate === day.iso ? "v3-day is-selected" : "v3-day"}
                        type="button"
                        aria-pressed={selectedDate === day.iso}
                        onClick={() => setSelectedDate(day.iso)}
                      >
                        <span>{day.weekday}</span>
                        <strong>{day.day}</strong>
                        <small>{day.month}</small>
                      </button>
                    ))
                  )}
                </div>
                <fieldset className="v3-time" disabled={!selectedDate}>
                  <legend>{selectedDay ? `Horários para ${selectedDay.full}` : "Selecione um dia para ver os horários"}</legend>
                  <div>
                    {["09:00", "11:30", "14:00", "16:30"].map((time) => (
                      <button
                        key={time}
                        className={selectedTime === time ? "is-selected" : ""}
                        type="button"
                        aria-pressed={selectedTime === time}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="v3-booking__actions">
                  <small>Agenda demonstrativa; os horários precisam de confirmação.</small>
                  <button className="v3-button" type="submit" disabled={!selectedDate || !selectedTime}>
                    Solicitar este horário <ArrowRight aria-hidden="true" />
                  </button>
                </div>
              </motion.form>
            )}

            {step === "done" && (
              <motion.div className="v3-booking__done" key="done" {...panelMotion}>
                <CircleCheckBig aria-hidden="true" />
                <span className="v3-kicker">Preferência registrada</span>
                <h3>Quase lá, {name.split(" ")[0]}.</h3>
                <p>
                  Você escolheu <strong>{selectedDay?.full}</strong>, às <strong>{selectedTime}</strong>.
                  {lead.whatsapp ? " Envie o pedido pelo WhatsApp para confirmar." : " Nesta demonstração, nada é enviado."}
                </p>
                {lead.whatsapp && (
                  <a className="v3-button" target="_blank" rel="noopener" href={`${lead.whatsapp}?text=${encodeURIComponent(`Olá! Sou ${name}. Gostaria de uma conversa em ${selectedDay?.full}, às ${selectedTime}. ${message}`)}`}>
                    Enviar pelo WhatsApp <ArrowRight aria-hidden="true" />
                  </a>
                )}
                <button className="v3-outline-button" type="button" onClick={() => setStep("message")}>
                  Fazer outra solicitação
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <a className={`v3-brand ${inverse ? "v3-brand--inverse" : ""}`} href="#inicio" aria-label={`${lead.nome} — início`}>
      <span className="lead-marca">
        <Image src={inverse ? "/brand/aurora-symbol.svg" : "/brand/aurora-symbol.svg"} alt="" width={48} height={48} />
        <span><strong>{lead.nome}</strong>{!/psic/i.test(lead.nome) && <small>Psicologia</small>}</span>
      </span>
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.2 11.6a8.2 8.2 0 0 1-12.1 7.2L3.5 20l1.3-4.4a8.2 8.2 0 1 1 15.4-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.1 7.7c.3-.4.6-.4.9-.4h.4c.2 0 .4 0 .5.4l.7 1.7c.1.3.1.5-.1.7l-.6.8c-.2.2-.1.4 0 .6.5.9 1.2 1.6 2 2.1.3.2.5.2.7 0l.8-1c.2-.2.4-.3.7-.2l1.7.8c.3.1.5.3.5.5 0 .3-.1 1.2-.7 1.8-.6.6-1.5.9-2.4.7-1.1-.2-2.6-.8-4.1-2.1-1.2-1.1-2.1-2.5-2.4-3.7-.3-1 .1-2 .5-2.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PsychologyHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroVideoSource, setHeroVideoSource] = useState<string | null>(null);
  const [heroVideoVisible, setHeroVideoVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  const revealProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 26 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.16 },
        transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as const },
      };

  const staggerProps = reduceMotion
    ? {}
    : {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.14 },
        variants: {
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
        },
      };

  const itemReveal = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => document.body.classList.remove("menu-is-open");
  }, [menuOpen]);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const handleScroll = () => setIsScrolled(window.scrollY > 72);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.history.scrollRestoration = previousRestoration;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const isDesktop = window.matchMedia("(min-width: 821px)").matches;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;

    if (!isDesktop) {
      if (connection?.saveData) return;
      const mobileVideoTimer = window.setTimeout(
        () => setHeroVideoSource(asset("/videos/consultorio-aurora-mobile.mp4")),
        1800,
      );
      return () => window.clearTimeout(mobileVideoTimer);
    }

    let listening = false;
    const loadVideo = () => {
      setHeroVideoSource(asset("/videos/consultorio-aurora-loop.mp4"));
      window.removeEventListener("scroll", loadVideo);
      window.removeEventListener("pointermove", loadVideo);
      window.removeEventListener("keydown", loadVideo);
    };
    const waitForFirstInteraction = window.setTimeout(() => {
      listening = true;
      window.addEventListener("scroll", loadVideo, { passive: true, once: true });
      window.addEventListener("pointermove", loadVideo, { passive: true, once: true });
      window.addEventListener("keydown", loadVideo, { once: true });
    }, 900);

    return () => {
      window.clearTimeout(waitForFirstInteraction);
      if (listening) {
        window.removeEventListener("scroll", loadVideo);
        window.removeEventListener("pointermove", loadVideo);
        window.removeEventListener("keydown", loadVideo);
      }
    };
  }, [reduceMotion]);

  return (
    <main className="v3-page" id="inicio">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>

      <header className={isScrolled ? "v3-header v3-header--island" : "v3-header"}>
        <div className="v3-shell v3-header__inner">
          <Brand />
          <nav className="v3-nav" aria-label="Navegação principal">
            <a href="#atendimentos">Atendimentos</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#equipe">Sobre</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
          <a className="v3-button v3-button--small" href="#agendamento">Agendar uma conversa</a>
          <button
            className="v3-menu-button"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="v3-mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        <div className={`v3-mobile-menu ${menuOpen ? "is-open" : ""}`} id="v3-mobile-menu">
          <nav aria-label="Navegação mobile">
            {[
              ["Atendimentos", "#atendimentos"],
              ["Como funciona", "#como-funciona"],
              ["Sobre", "#equipe"],
              ["Dúvidas", "#duvidas"],
              ["Localização", "#localizacao"],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}<ArrowRight aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section className="v3-hero" aria-labelledby="hero-title">
        <motion.div
          className="v3-hero__photo"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.04, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/images/consultorio-aurora-v2.webp"
            alt="Imagem ilustrativa de consultório com mármore claro e detalhes dourados"
            fill
            priority
            sizes="(max-width: 820px) 108vw, 58vw"
          />
          {heroVideoSource && (
            <video
              className={heroVideoVisible ? "is-visible" : ""}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-label="Vídeo ilustrativo de um consultório"
              onCanPlay={() => setHeroVideoVisible(true)}
            >
              <source src={heroVideoSource} type="video/mp4" />
            </video>
          )}
        </motion.div>
        <div className="v3-shell v3-hero__inner">
          <motion.div
            className="v3-hero__copy"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 id="hero-title">
              Há um jeito mais <em className="v3-editorial-accent">leve</em> de estar consigo.
            </h1>
            <p>Um espaço seguro para compreender seus caminhos e construir mudanças possíveis — no seu tempo.</p>
            <div className="v3-hero__actions">
              <a className="v3-button" href="#agendamento">Quero conversar</a>
              <span><LockKeyhole aria-hidden="true" /> Atendimento ético e sigiloso</span>
            </div>
          </motion.div>
        </div>
        <svg className="v3-gold-thread" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true">
          <motion.path
            d="M0 86C125 56 187 123 315 102s141-91 286-45 241 74 390 12 254-38 449-69"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.25, delay: 0.25, ease: "easeInOut" }}
          />
        </svg>
      </section>

      <div id="conteudo">
        <motion.section className="v3-intro" id="atendimentos" aria-labelledby="services-title" {...revealProps}>
          <motion.div className="v3-shell v3-intro__grid" {...staggerProps}>
            <motion.div className="v3-intro__welcome" variants={itemReveal}>
              <span className="v3-kicker v3-kicker--brand">
                <Image src="/brand/aurora-symbol.svg" alt="" width={32} height={32} />
                Boas-vindas
              </span>
              <h2>Um lugar de escuta que acolhe e direciona.</h2>
            </motion.div>
            <motion.div className="v3-intro__text" variants={itemReveal}>
              <p>Acreditamos que cada história merece ser ouvida com respeito e profundidade. Aqui, você encontra apoio profissional para entender o que sente e fazer escolhas mais alinhadas com quem você é.</p>
              <a href="#equipe">Conheça o espaço <ArrowRight aria-hidden="true" /></a>
            </motion.div>
            <motion.div className="v3-services" variants={itemReveal}>
              <span className="v3-kicker">Atendimentos</span>
              <h2 id="services-title">Escolha o que faz sentido para você.</h2>
              <AuroraScrollStack>
                {services.map(({ title, description, image, alt }, index) => (
                  <AuroraScrollStackItem key={title} index={index}>
                    <article className={`v3-service-panel v3-service-panel--${index + 1}`}>
                      <div className="v3-services__visual">
                        <Image
                          src={image}
                          alt={alt}
                          fill
                          sizes="(max-width: 560px) calc(100vw - 28px), 720px"
                        />
                      </div>
                      <div className="v3-services__copy">
                        <span className="v3-service-panel__eyebrow">
                          {index === 0 ? "Um espaço para você" : index === 1 ? "Escuta compartilhada" : "Cuidado onde estiver"}
                        </span>
                        <h3>{title}</h3>
                        <p>{description}</p>
                        <small>
                          {index === 0
                            ? "Presencial ou online"
                            : index === 1
                              ? "Um encontro para os dois"
                              : "Com privacidade e presença"}
                        </small>
                      </div>
                    </article>
                  </AuroraScrollStackItem>
                ))}
              </AuroraScrollStack>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section
          className="v3-recognition v3-recognition--layer"
          aria-labelledby="recognition-title"
          initial={reduceMotion ? false : { opacity: 0.96, y: 90 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.06 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <RecognitionReveal />
          <div className="v3-shell v3-recognition__body">
            <RecognitionOrbit items={recognition} />
          </div>
        </motion.section>

        <AboutStory />

        <motion.section className="v3-process" id="como-funciona" aria-labelledby="process-title" {...revealProps}>
          <div className="v3-shell">
            <motion.div className="v3-section-title" {...revealProps}>
              <span className="v3-kicker">Seu primeiro contato</span>
              <h2 id="process-title">
                Começa com uma conversa, não com uma{" "}
                <em className="v3-editorial-accent">decisão.</em>
              </h2>
              <p>Você entende como funciona, tira suas dúvidas e percebe se este é o momento certo.</p>
            </motion.div>
            <div className="v3-process__steps">
              <motion.span
                className="v3-process__draw-line v3-process__draw-line--desktop"
                initial={reduceMotion ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
              />
              <motion.span
                className="v3-process__draw-line v3-process__draw-line--mobile"
                initial={reduceMotion ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
              />
              <motion.ol className="v3-process__list" {...staggerProps}>
                {process.map(({ title, description }, index) => (
                  <motion.li key={title} variants={itemReveal}>
                    <span className="v3-process__number">{index + 1}</span>
                    <div><h3>{title}</h3><p>{description}</p></div>
                  </motion.li>
                ))}
              </motion.ol>
            </div>
          </div>
        </motion.section>

        <motion.section className="v3-session" aria-labelledby="session-title" {...revealProps}>
          <motion.div className="v3-shell v3-session__grid" {...staggerProps}>
            <motion.div className="v3-session__intro" variants={itemReveal}>
              <span className="v3-kicker">Como é estar em sessão</span>
              <h2 id="session-title">
                Você pode chegar exatamente <em className="v3-editorial-accent">como está.</em>
              </h2>
              <p>
                Não existe fala perfeita, assunto pequeno demais ou obrigação de contar tudo de uma vez.
                O encontro acontece no seu ritmo, com escuta atenta e perguntas que ajudam a organizar o que
                hoje parece confuso.
              </p>
              <a href="#agendamento">Quero dar o primeiro passo <ArrowRight aria-hidden="true" /></a>
            </motion.div>
            <motion.div className="v3-session__conversation" variants={itemReveal}>
              <div className="v3-session__image">
                <Image
                  src="/illustrations/session-listening.svg"
                  alt="Ilustração vetorial de duas poltronas conectadas por uma linha dourada"
                  fill
                  sizes="(max-width: 820px) calc(100vw - 32px), 560px"
                />
              </div>
              <div className="v3-session__content">
                <span className="v3-session__label">
                  <Image src="/brand/aurora-symbol.svg" alt="" width={26} height={26} />
                  Durante o processo
                </span>
                <ul>
                  <li><strong>Você traz o que está vivo agora.</strong><span>Uma situação, uma sensação, uma dúvida ou até o silêncio.</span></li>
                  <li><strong>Nós olhamos juntos.</strong><span>Sem julgamento e sem respostas prontas para a sua vida.</span></li>
                  <li><strong>O caminho ganha contorno.</strong><span>Aos poucos, você reconhece padrões, recursos e novas possibilidades.</span></li>
                </ul>
                <p><LockKeyhole aria-hidden="true" /> Tudo o que é compartilhado é tratado com ética, cuidado e sigilo profissional.</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section className="v3-faq" id="duvidas" aria-labelledby="faq-title" {...revealProps}>
          <motion.div className="v3-shell v3-faq__grid" {...staggerProps}>
            <motion.div variants={itemReveal}>
              <span className="v3-kicker">Dúvidas frequentes</span>
              <h2 id="faq-title">Antes de começar, é normal ter dúvidas.</h2>
              <p>Reunimos respostas diretas para deixar o primeiro contato mais tranquilo.</p>
            </motion.div>
            <motion.div className="v3-faq__list" {...staggerProps}>
              {questions.map(([question, answer], index) => (
                <motion.article className="v3-faq__item" key={question} variants={itemReveal} layout>
                  <button
                    className="v3-faq__question"
                    id={`faq-question-${index}`}
                    type="button"
                    aria-expanded={openQuestion === index}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setOpenQuestion((current) => current === index ? null : index)}
                  >
                    {question}
                    <motion.span
                      animate={{ rotate: openQuestion === index ? 180 : 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.22 }}
                      aria-hidden="true"
                    >
                      <ChevronDown />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openQuestion === index && (
                      <motion.div
                        className="v3-faq__answer"
                        id={`faq-answer-${index}`}
                        role="region"
                        aria-labelledby={`faq-question-${index}`}
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0.01 : 0.26, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <motion.p
                          initial={reduceMotion ? false : { y: -8 }}
                          animate={{ y: 0 }}
                          transition={{ duration: reduceMotion ? 0.01 : 0.24 }}
                        >
                          {answer}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section className="v3-location" id="localizacao" aria-labelledby="location-title" {...revealProps}>
          <motion.div className="v3-shell v3-location__grid" {...staggerProps}>
            <motion.div className="v3-location__copy" variants={itemReveal}>
              <span className="v3-kicker">Onde estamos</span>
              <h2 id="location-title">
                Um espaço pensado para você chegar{" "}
                <em className="v3-editorial-accent">com calma.</em>
              </h2>
              <ul>
                {(lead.endereco || lead.cidade) && (
                  <li><MapPin aria-hidden="true" /><span><strong>{lead.endereco || lead.cidade}</strong>{lead.endereco ? lead.cidade : ""}</span></li>
                )}
                {lead.telefone && <li><Phone aria-hidden="true" /><span>{lead.telefone}</span></li>}
              </ul>
              {lead.maps && (
                <a className="v3-outline-button" href={lead.maps} target="_blank" rel="noreferrer">
                  <MapPin aria-hidden="true" /> Ver como chegar
                </a>
              )}
            </motion.div>
            <motion.div className="v3-map" role="img" aria-label="Mapa ilustrativo, sem escala" variants={itemReveal}>
              <svg viewBox="0 0 760 410" aria-hidden="true">
                <rect width="760" height="410" fill="#eee9e2" />
                <g className="v3-map__blocks">
                  <path d="M24 24h184v84H24zM244 18h198v106H244zM478 18h252v88H478zM18 147h238v105H18zM294 156h166v118H294zM510 140h226v122H510zM20 294h168v94H20zM224 307h238v81H224zM500 298h236v90H500z" />
                </g>
                <path className="v3-map__road v3-map__road--wide" d="M-20 330C146 280 254 272 382 207S610 93 790 58" />
                <path className="v3-map__road" d="M215-20c15 132 32 273 4 460M506-20c-18 146-3 293 48 460" />
                <path className="v3-map__route" d="M90 332c93-29 160-47 226-82s120-60 194-103" />
                <g className="v3-map__pin" transform="translate(486 100)">
                  <path d="M34 0C15 0 0 15 0 34c0 25 34 66 34 66s34-41 34-66C68 15 53 0 34 0Z" />
                  <circle cx="34" cy="34" r="20" />
                  <image href={asset("/brand/aurora-symbol.svg")} x="17" y="17" width="34" height="34" />
                </g>
                <text x="270" y="358" className="v3-map__label">{lead.cidade}</text>
              </svg>
            </motion.div>
          </motion.div>
        </motion.section>

        <BookingFlow />

        <motion.section className="v3-contact" id="contato" aria-labelledby="contact-title" {...revealProps}>
          <div className="v3-shell v3-contact__inner">
            <Brand inverse />
            <h2 id="contact-title">Quando fizer sentido, estamos aqui.</h2>
            <p>O primeiro contato pode ser apenas uma conversa — sem pressa e sem compromisso.</p>
            <a className="v3-button v3-button--light" href="#agendamento">
              Agendar uma conversa <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </motion.section>
      </div>

      <footer className="v3-footer">
        <span>© {lead.ano} {lead.nome}</span>
        <span>Prévia demonstrativa, não é o site oficial. Imagens e vídeo ilustrativos. Não substitui atendimento profissional.</span>
      </footer>

      <motion.a
        className="v3-mobile-contact"
        href={lead.whatsapp || "#agendamento"}
        aria-label={`Conversar com ${lead.nome} pelo WhatsApp`}
        target={lead.whatsapp ? "_blank" : undefined}
        rel="noopener"
        initial={reduceMotion ? false : { opacity: 0, x: 26, scale: 0.82 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.5, delay: reduceMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      >
        <span className="v3-mobile-contact__icon"><WhatsAppIcon /></span>
        <motion.span
          className="v3-mobile-contact__label"
          initial={reduceMotion ? false : { opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{ duration: reduceMotion ? 0.01 : 0.42, delay: reduceMotion ? 0 : 1.45 }}
        >
          Conversar no WhatsApp
        </motion.span>
      </motion.a>
    </main>
  );
}
