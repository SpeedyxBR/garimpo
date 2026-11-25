"""Copia o site "Clínica Aurora" e troca o que é fictício por dados do lead.

Uso:  python3 modelos/psicologia/montar.py [pasta-do-projeto-psi]
Gera: modelos/psicologia/src (cópia adaptada), public/modelos/psicologia (app.js, app.css e mídia)
O projeto original só é lido.
"""
import pathlib
import re
import shutil
import subprocess
import sys

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent.parent
PSI = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else RAIZ.parent / "psi").resolve()
SRC = AQUI / "src"
PUB = RAIZ / "public/modelos/psicologia"
BASE = "/modelos/psicologia"

shutil.rmtree(SRC, ignore_errors=True)
shutil.rmtree(PUB, ignore_errors=True)
shutil.copytree(PSI / "components", SRC / "components")
for css in ("globals.css", "aurora-v3.css"):
    shutil.copy(PSI / "app" / css, SRC / css)


def editar(arquivo, trocas):
    p = SRC / arquivo
    s = p.read_text(encoding="utf-8")
    for velho, novo in trocas:
        assert velho in s, f"{arquivo}: não achei {velho[:60]!r}"
        s = s.replace(velho, novo)
    p.write_text(s, encoding="utf-8")


def bloco(arquivo, inicio, fim, novo):
    """Troca do começo de `inicio` até o fim de `fim`."""
    p = SRC / arquivo
    s = p.read_text(encoding="utf-8")
    a = s.index(inicio)
    b = s.index(fim, a) + len(fim)
    p.write_text(s[:a] + novo + s[b:], encoding="utf-8")


HOME = "components/psychology-home.tsx"
SOBRE = "components/ui/about-story.tsx"

editar(HOME, [
    ('} from "lucide-react";', '} from "lucide-react";\nimport { lead } from "@/lead";'),
    ('"As duas modalidades estão disponíveis, sempre com privacidade e os mesmos princípios éticos."',
     '"Confirme no primeiro contato quais modalidades estão disponíveis."'),
    # fim do agendamento: leva para o WhatsApp em vez de fingir um envio
    ("""                  Você escolheu <strong>{selectedDay?.full}</strong>, às <strong>{selectedTime}</strong>.
                  Neste template, o envio é apenas demonstrativo.
                </p>""",
     """                  Você escolheu <strong>{selectedDay?.full}</strong>, às <strong>{selectedTime}</strong>.
                  {lead.whatsapp ? " Envie o pedido pelo WhatsApp para confirmar." : " Nesta demonstração, nada é enviado."}
                </p>
                {lead.whatsapp && (
                  <a className="v3-button" target="_blank" rel="noopener" href={`${lead.whatsapp}?text=${encodeURIComponent(`Olá! Sou ${name}. Gostaria de uma conversa em ${selectedDay?.full}, às ${selectedTime}. ${message}`)}`}>
                    Enviar pelo WhatsApp <ArrowRight aria-hidden="true" />
                  </a>
                )}"""),
    ("<h3>Obrigada, {name.split(\" \")[0]}.</h3>", "<h3>Quase lá, {name.split(\" \")[0]}.</h3>"),
    ("A clínica confirmará a disponibilidade no retorno.", "A disponibilidade é confirmada no retorno."),
    ("Esta agenda é demonstrativa; a confirmação final é feita pela clínica.", "Agenda demonstrativa; os horários precisam de confirmação."),
    ('aria-label="Clínica Aurora — início"', 'aria-label={`${lead.nome} — início`}'),
    ('<a href="#equipe">Sobre mim</a>', '<a href="#equipe">Sobre</a>'),
    ('["Sobre mim", "#equipe"]', '["Sobre", "#equipe"]'),
    ('alt="Consultório da Clínica Aurora com mármore claro e detalhes dourados"', 'alt="Imagem ilustrativa de consultório com mármore claro e detalhes dourados"'),
    ('aria-label="Tour pelo consultório da Clínica Aurora"', 'aria-label="Vídeo ilustrativo de um consultório"'),
    ("Bem-vindo(a) à Aurora", "Boas-vindas"),
    ("Na Aurora, acreditamos que", "Acreditamos que"),
    ("Conheça a clínica ", "Conheça o espaço "),
    ('aria-label="Conversar com a Clínica Aurora pelo WhatsApp"', 'aria-label={`Conversar com ${lead.nome} pelo WhatsApp`}\n        target={lead.whatsapp ? "_blank" : undefined}\n        rel="noopener"'),
    ('className="v3-mobile-contact"\n        href="#agendamento"', 'className="v3-mobile-contact"\n        href={lead.whatsapp || "#agendamento"}'),
    ("<span>© 2026 Clínica Aurora</span>", "<span>© {lead.ano} {lead.nome}</span>"),
    ("<span>Conteúdo demonstrativo. Não substitui atendimento profissional.</span>",
     "<span>Prévia demonstrativa, não é o site oficial. Imagens e vídeo ilustrativos. Não substitui atendimento profissional.</span>"),
])

# marca: o logotipo original tem "AURORA" desenhado; vira símbolo + nome do lead
bloco(HOME, "      <Image\n        className=\"v3-brand__image\"", "      />\n    </a>",
      """      <span className="lead-marca">
        <Image src={inverse ? "/brand/aurora-symbol.svg" : "/brand/aurora-symbol.svg"} alt="" width={48} height={48} />
        <span><strong>{lead.nome}</strong>{!/psic/i.test(lead.nome) && <small>Psicologia</small>}</span>
      </span>
    </a>""")

# localização e mapa
bloco(HOME, "              <h2 id=\"location-title\">", "            </motion.div>\n          </motion.div>\n        </motion.section>\n\n        <BookingFlow />",
      """              <h2 id="location-title">
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

        <BookingFlow />""")
editar(HOME, [
    ("  MapPin,\n  Menu,\n  TrainFront,\n", "  MapPin,\n  Menu,\n  Phone,\n"),
    ('import { lead } from "@/lead";', 'import { lead, asset } from "@/lead";'),
    ('"/videos/consultorio-aurora-mobile.mp4"', 'asset("/videos/consultorio-aurora-mobile.mp4")'),
    ('"/videos/consultorio-aurora-loop.mp4"', 'asset("/videos/consultorio-aurora-loop.mp4")'),
])
s = (SRC / HOME).read_text(encoding="utf-8")
(SRC / HOME).write_text(s, encoding="utf-8")

# "Sobre": a biografia e o retrato eram inventados
editar(SOBRE, [
    ('import { useRef } from "react";', 'import { useRef } from "react";\nimport { lead } from "@/lead";'),
    ("          Sobre mim\n", "          Sobre o atendimento\n"),
    ("Antes de existir uma clínica, existia uma{\" \"}", "Antes de qualquer resposta, existe uma{\" \"}"),
    ("Como ajudar alguém a voltar para si", "Como ajudar alguém a voltar para si"),
    ('aria-label="Apresentação profissional"', 'aria-label="Apresentação"'),
    ('src="/images/dra-helena-martins-placeholder.png"', 'src={lead.foto || "/images/sessao-escuta-aurora.png"}'),
    ('alt="Retrato ilustrativo da Dra. Helena Martins em seu consultório"', 'alt={lead.foto ? lead.nome : "Imagem ilustrativa de uma sessão"}'),
    ("<span>Dra. Helena Martins</span>", "<span>{lead.nome}</span>"),
    ("<small>Psicóloga clínica · CRP 00/000000</small>", "<small>{lead.foto ? lead.cidade : \"Imagem ilustrativa\"}</small>"),
])
bloco(SOBRE, "const chapters = [", "];", """const chapters = [
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
];""")
bloco(SOBRE, "          <p className=\"v3-about-story__lead\">", "          </p>", """          <p className="v3-about-story__lead">
            O trabalho parte dessa pergunta. Ela orienta a forma de receber cada
            pessoa e de construir, junto com ela, o acompanhamento.
          </p>""")
bloco(SOBRE, "      <small className=\"v3-template-note\">", "      </small>\n", "")

# next/image não existe fora do Next
(SRC / "imagem.tsx").write_text('''import type { ImgHTMLAttributes } from "react";
import { asset } from "@/lead";

type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string; fill?: boolean; priority?: boolean };

export default function Image({ src, fill, priority, sizes, style, alt = "", ...resto }: Props) {
  return (
    <img
      {...resto}
      alt={alt}
      src={asset(src)}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", color: "transparent", ...style } : style}
    />
  );
}
''', encoding="utf-8")

(SRC / "lead.ts").write_text(f'''const d = document.getElementById("app")?.dataset ?? {{}};
const link = (v?: string) => (v && /^https?:\\/\\//i.test(v) ? v : "");

export const lead = {{
  nome: (d.nome ?? "").split("|")[0].trim() || "Consultório",
  cidade: d.cidade ?? "",
  endereco: d.endereco ?? "",
  telefone: d.telefone ?? "",
  whatsapp: link(d.whatsapp),
  maps: link(d.maps),
  foto: link(d.foto),
  ano: d.ano ?? "",
}};

/** Caminho local vira o da pasta do modelo; PNG foi convertido para JPG. */
export const asset = (src: string) =>
  src.startsWith("/") ? "{BASE}" + src.replace(/\\.png$/, ".jpg") : src;
''', encoding="utf-8")

(SRC / "main.tsx").write_text('''import { createRoot } from "react-dom/client";
import { PsychologyHome } from "@/components/psychology-home";
import "./globals.css";
import "./aurora-v3.css";
import "./lead.css";

createRoot(document.getElementById("app")!).render(<PsychologyHome />);
''', encoding="utf-8")

(SRC / "lead.css").write_text('''.lead-marca { display: flex; align-items: center; gap: 12px; min-width: 0; }
.lead-marca img { width: 48px; height: 48px; flex: none; }
.lead-marca > span { display: grid; min-width: 0; text-align: left; }
.lead-marca strong { font: 400 17px/1.2 Georgia, "Times New Roman", serif; letter-spacing: .08em; text-transform: uppercase; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; max-width: 230px; }
.lead-marca small { font-size: 10px; letter-spacing: .22em; text-transform: uppercase; opacity: .7; }
.v3-brand--inverse .lead-marca { justify-content: center; color: #fffefb; }
.v3-brand--inverse .lead-marca strong { -webkit-line-clamp: 4; }
@media (max-width: 560px) { .lead-marca img { width: 38px; height: 38px; } .lead-marca strong { font-size: 13px; max-width: 170px; } }
''', encoding="utf-8")

# CSS aponta para a textura na raiz do site
for css in ("globals.css", "aurora-v3.css"):
    p = SRC / css
    p.write_text(p.read_text(encoding="utf-8").replace('url("/textures/', f'url("{BASE}/textures/'), encoding="utf-8")

# mídia usada
for pasta in ("brand", "illustrations", "textures", "images", "videos"):
    (PUB / pasta).mkdir(parents=True, exist_ok=True)
for arq in ["brand/aurora-symbol.svg", "textures/warm-marble.svg", "images/consultorio-aurora-v2.webp",
            "videos/consultorio-aurora-loop.mp4", "videos/consultorio-aurora-mobile.mp4",
            *[f"illustrations/{n}.svg" for n in ("therapy-individual", "therapy-couples", "therapy-online", "session-listening")]]:
    shutil.copy(PSI / "public" / arq, PUB / arq)
for nome in ("recognition-mind", "recognition-alone", "recognition-relationship", "recognition-change", "sessao-escuta-aurora"):
    subprocess.run(["sips", "-Z", "1100", "-s", "format", "jpeg", "-s", "formatOptions", "78",
                    str(PSI / f"public/images/{nome}.png"), "--out", str(PUB / f"images/{nome}.jpg")],
                   check=True, stdout=subprocess.DEVNULL)

sobra = [(str(p.relative_to(SRC)), m) for p in SRC.rglob("*.tsx") for m in re.findall(r".*(?:Helena|CRP |Eldorado|Rebouças|Clínica Aurora).*", p.read_text(encoding="utf-8"))]
assert not sobra, f"dados fictícios restantes: {sobra}"

esbuild = RAIZ / "servicos/rastro/node_modules/.bin/esbuild"
subprocess.run([str(esbuild), str(SRC / "main.tsx"), "--bundle", "--minify", "--format=iife", "--jsx=automatic",
                f"--outfile={PUB / 'app.js'}", f"--alias:@={SRC}", f"--alias:next/image={SRC / 'imagem.tsx'}",
                # uma cópia só do React (o pnpm espalha links que o esbuild trataria como duas)
                f"--alias:react={(PSI / 'node_modules/react').resolve()}",
                f"--alias:react-dom={(PSI / 'node_modules/react-dom').resolve()}",
                '--define:process.env.NODE_ENV="production"', f"--external:{BASE}/*", "--log-level=warning"],
               check=True, env={"NODE_PATH": str(PSI / "node_modules"), "PATH": "/usr/bin:/bin:/usr/local/bin:/opt/homebrew/bin"})
print("ok:", PUB)
