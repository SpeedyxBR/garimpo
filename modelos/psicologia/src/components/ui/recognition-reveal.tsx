"use client";

import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { MessageCircle } from "lucide-react";
import { useRef } from "react";

const headline = [
  "Nem",
  "sempre",
  "é",
  "fácil",
  "explicar",
  "o",
  "que",
  "está",
  "acontecendo.",
];

function RevealWord({
  children,
  index,
  progress,
  reduced,
}: {
  children: string;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const start = index / (headline.length + 3);
  const end = start + 0.24;
  const opacity = useTransform(progress, [start, end], [0.16, 1], { clamp: true });
  const y = useTransform(progress, [start, end], [18, 0], { clamp: true });
  const blur = useTransform(progress, [start, end], [5, 0], { clamp: true });
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  return (
    <motion.span
      className={index >= 7 ? "v3-recognition-reveal__word is-editorial" : "v3-recognition-reveal__word"}
      style={reduced ? undefined : { opacity, y, filter }}
      aria-hidden="true"
    >
      {children}
    </motion.span>
  );
}

export function RecognitionReveal() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start 72%", "end 70%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 115,
    damping: 28,
    mass: 0.32,
  });
  const pathLength = useTransform(progress, [0.08, 0.88], [0, 1], { clamp: true });
  const pathOpacity = useTransform(progress, [0, 0.12, 0.92, 1], [0, 0.7, 0.7, 0.18]);
  const asideOpacity = useTransform(progress, [0.58, 0.82], [0, 1], { clamp: true });
  const asideY = useTransform(progress, [0.58, 0.82], [18, 0], { clamp: true });

  return (
    <div className="v3-recognition-reveal" ref={stageRef}>
      <div className="v3-recognition-reveal__sticky">
        <div className="v3-shell v3-recognition-reveal__inner">
          <span className="v3-kicker">Talvez você se reconheça aqui</span>
          <h2 id="recognition-title" aria-label="Nem sempre é fácil explicar o que está acontecendo.">
            <span className="sr-only">Nem sempre é fácil explicar o que está acontecendo.</span>
            {headline.map((word, index) => (
              <RevealWord
                key={`${word}-${index}`}
                index={index}
                progress={progress}
                reduced={reduced}
              >
                {word}
              </RevealWord>
            ))}
          </h2>

          <motion.div
            className="v3-recognition-reveal__aside"
            style={reduced ? undefined : { opacity: asideOpacity, y: asideY }}
          >
            <p>
              Você não precisa ter todas as respostas — nem esperar que tudo fique insustentável —
              para procurar ajuda.
            </p>
            <span>
              <MessageCircle aria-hidden="true" />
              Podemos começar pelo que é possível dizer hoje.
            </span>
          </motion.div>

          <svg
            className="v3-recognition-reveal__thread"
            viewBox="0 0 1200 260"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d="M-40 184C85 155 111 232 204 193c72-30 15-102 89-105 82-3 31 122 112 119 77-3 75-81 154-72 84 10 97 83 195 60 121-28 164-96 294-72 72 13 118 51 192 33"
              style={reduced ? undefined : { pathLength, opacity: pathOpacity }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
