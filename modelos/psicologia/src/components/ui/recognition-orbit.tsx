"use client";

import Image from "next/image";
import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";

export type RecognitionItem = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

const finalX = [-438, -146, 146, 438];
const finalRotate = [-2.5, 1.5, -1.5, 2.5];

function OrbitCard({
  item,
  index,
  progress,
}: {
  item: RecognitionItem;
  index: number;
  progress: MotionValue<number>;
}) {
  const x = useTransform(progress, (value) => {
    const orbitProgress = Math.min(value / 0.62, 1);
    const settleProgress = Math.max(0, Math.min((value - 0.58) / 0.28, 1));
    const angle = index * (Math.PI / 2) - Math.PI / 2 + orbitProgress * Math.PI * 1.7;
    const orbitX = Math.cos(angle) * 218;
    return orbitX + (finalX[index] - orbitX) * settleProgress;
  });
  const y = useTransform(progress, (value) => {
    const orbitProgress = Math.min(value / 0.62, 1);
    const settleProgress = Math.max(0, Math.min((value - 0.58) / 0.28, 1));
    const angle = index * (Math.PI / 2) - Math.PI / 2 + orbitProgress * Math.PI * 1.7;
    const orbitY = Math.sin(angle) * 112 - 54;
    const finalY = 50;
    return orbitY + (finalY - orbitY) * settleProgress;
  });
  const rotate = useTransform(progress, (value) => {
    const settleProgress = Math.max(0, Math.min((value - 0.58) / 0.28, 1));
    const orbitRotate = index * 9 - 13 + value * 70;
    return orbitRotate + (finalRotate[index] - orbitRotate) * settleProgress;
  });
  const scale = useTransform(progress, [0, 0.2, 0.58, 0.86], [0.78, 1, 0.9, 1]);
  const opacity = useTransform(
    progress,
    [index * 0.055, 0.12 + index * 0.055],
    [0, 1],
    { clamp: true },
  );
  const copyOpacity = useTransform(progress, [0.66, 0.84], [0, 1], { clamp: true });
  const copyY = useTransform(progress, [0.66, 0.84], [18, 0], { clamp: true });

  return (
    <motion.article
      className="v3-recognition-orbit__card"
      style={{ x, y, rotate, scale, opacity, zIndex: 10 + index }}
    >
      <div className="v3-recognition-orbit__image">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="260px"
        />
        <span aria-hidden="true">0{index + 1}</span>
      </div>
      <motion.div
        className="v3-recognition-orbit__copy"
        style={{ opacity: copyOpacity, y: copyY }}
      >
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </motion.div>
    </motion.article>
  );
}

function StaticRecognition({
  items,
  animated = false,
}: {
  items: RecognitionItem[];
  animated?: boolean;
}) {
  return (
    <div className="v3-recognition-orbit__static">
      {items.map((item, index) => (
        <motion.article
          key={item.title}
          initial={animated ? { opacity: 0, y: 64, rotate: index % 2 === 0 ? -3 : 3 } : false}
          whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -0.8 : 0.8 }}
          viewport={{ once: true, amount: 0.36 }}
          transition={{
            duration: 0.62,
            delay: index === 0 ? 0 : 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="v3-recognition-orbit__image">
            <Image src={item.image} alt={item.alt} fill sizes="(max-width: 720px) 42vw, 260px" />
            <span aria-hidden="true">0{index + 1}</span>
          </div>
          <div className="v3-recognition-orbit__copy">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export function RecognitionOrbit({ items }: { items: RecognitionItem[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start 68%", "end 78%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 26,
    mass: 0.34,
  });
  const ringRotate = useTransform(progress, [0, 0.62], [0, 306], { clamp: true });
  const ringScale = useTransform(progress, [0, 0.42, 0.76], [0.72, 1, 1.18]);
  const ringOpacity = useTransform(progress, [0, 0.12, 0.64, 0.82], [0, 0.55, 0.38, 0]);
  const cueOpacity = useTransform(progress, [0, 0.18, 0.52, 0.65], [0, 1, 1, 0]);

  if (reduced) {
    return <StaticRecognition items={items} />;
  }

  return (
    <div className="v3-recognition-orbit" ref={stageRef}>
      <div className="v3-recognition-orbit__desktop">
        <div className="v3-recognition-orbit__sticky">
          <div className="v3-recognition-orbit__canvas">
            <motion.div
              className="v3-recognition-orbit__ring"
              style={{ rotate: ringRotate, scale: ringScale, opacity: ringOpacity }}
              aria-hidden="true"
            >
              <span />
            </motion.div>
            <motion.p className="v3-recognition-orbit__cue" style={{ opacity: cueOpacity }}>
              Histórias diferentes. Um primeiro passo possível.
            </motion.p>
            {items.map((item, index) => (
              <OrbitCard
                key={item.title}
                item={item}
                index={index}
                progress={progress}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="v3-recognition-orbit__mobile">
        <StaticRecognition items={items} animated />
      </div>
    </div>
  );
}
