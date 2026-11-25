"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { lead } from "@/lead";

const chapters = [
  {
    year: "01",
    title: "A escuta vem primeiro",
    description:
      "Cada atendimento começa por ouvir com atenção o que a pessoa traz, no tempo em que ela consegue dizer.",
  },
  {
    year: "02",
    title: "O caminho ganha forma",
    description:
      "Com objetivos conversados em conjunto, o acompanhamento se organiza com método e responsabilidade.",
  },
  {
    year: "03",
    title: "Novas maneiras de compreender",
    description:
      "Aos poucos, ficam mais claros os padrões, os vínculos e as possibilidades de mudança.",
  },
  {
    year: "Sempre",
    title: "Um lugar de cuidado",
    description:
      "Um espaço ético e humano para que cada pessoa possa se escutar com mais clareza.",
  },
];

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDListElement>(null);
  const reduced = Boolean(useReducedMotion());
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start 76%", "end 48%"],
  });
  const progress = useSpring(timelineProgress, {
    stiffness: 105,
    damping: 28,
    mass: 0.32,
  });
  const portraitProgress = useSpring(timelineProgress, {
    stiffness: 66,
    damping: 28,
    mass: 0.5,
  });
  const portraitY = useTransform(
    portraitProgress,
    [0, 0.2, 0.9, 1],
    [0, 0, 66, 74],
  );
  const portraitScale = useTransform(sectionProgress, [0.12, 0.5, 0.9], [1.035, 1, 1.025]);
  const frameRotate = useTransform(sectionProgress, [0.18, 0.82], [-2.2, 1.4]);

  return (
    <section
      className="v3-about v3-about-story"
      id="equipe"
      aria-labelledby="about-story-title"
      ref={sectionRef}
    >
      <div className="v3-shell v3-about-story__heading">
        <span className="v3-kicker">
          <Image src="/brand/aurora-symbol.svg" alt="" width={28} height={28} />
          Sobre o atendimento
        </span>
        <h2 id="about-story-title">
          Antes de qualquer resposta, existe uma{" "}
          <em className="v3-editorial-accent">pergunta.</em>
        </h2>
        <p>
          Como ajudar alguém a voltar para si sem oferecer respostas prontas para uma
          história que só essa pessoa conhece?
        </p>
      </div>

      <div className="v3-shell v3-about-story__layout">
        <aside className="v3-about-story__portrait-column" aria-label="Apresentação">
          <div className="v3-about-story__portrait-sticky">
            <motion.div
              className="v3-about-story__frame"
              style={reduced ? undefined : { rotate: frameRotate, y: portraitY }}
              aria-hidden="true"
            />
            <motion.figure
              className="v3-about-story__portrait"
              style={reduced ? undefined : { y: portraitY, scale: portraitScale }}
            >
              <Image
                src={lead.foto || "/images/sessao-escuta-aurora.png"}
                alt={lead.foto ? lead.nome : "Imagem ilustrativa de uma sessão"}
                fill
                sizes="(max-width: 820px) calc(100vw - 32px), 500px"
              />
              <figcaption>
                <span>{lead.nome}</span>
                <small>{lead.foto ? lead.cidade : "Imagem ilustrativa"}</small>
              </figcaption>
            </motion.figure>
            <motion.p
              className="v3-about-story__portrait-note"
              style={reduced ? undefined : { y: portraitY }}
            >
              A escuta não como resposta pronta, mas como presença.
            </motion.p>
          </div>
        </aside>

        <div className="v3-about-story__narrative">
          <p className="v3-about-story__lead">
            O trabalho parte dessa pergunta. Ela orienta a forma de receber cada
            pessoa e de construir, junto com ela, o acompanhamento.
          </p>

          <dl className="v3-about-story__timeline" ref={timelineRef}>
            <motion.span
              className="v3-about-story__progress"
              style={reduced ? { scaleY: 1 } : { scaleY: progress }}
              aria-hidden="true"
            />
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.year}
                initial={reduced ? false : { opacity: 0.28, y: 38 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: reduced ? 0.01 : 0.5,
                  delay: index === 0 ? 0 : 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <dt>
                  <span>{chapter.year}</span>
                  {chapter.title}
                </dt>
                <dd>{chapter.description}</dd>
              </motion.div>
            ))}
          </dl>

          <motion.blockquote
            initial={reduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: reduced ? 0.01 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span aria-hidden="true">“</span>
            Cuidar da mente é também cultivar uma vida com mais sentido e presença.
            <span aria-hidden="true">”</span>
          </motion.blockquote>
        </div>
      </div>

    </section>
  );
}
