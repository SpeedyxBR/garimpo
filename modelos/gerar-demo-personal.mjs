// Gera a demonstração do modelo Personal trainer com um personal fictício.
// Uso: node modelos/gerar-demo-personal.mjs  →  public/demos/personal.html
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
const R = new URL("..", import.meta.url).pathname;
const { preencher, valoresDoNegocio } = await import(R + "src/lib/modelos.ts");
const modelo = readFileSync(R + "modelos/personal.html", "utf8");
const foto = "https://images.unsplash.com/photo-1758875568932-0eefd3e60090?auto=format&fit=crop&w=900&q=72";
let html = preencher(modelo, { ...valoresDoNegocio({ nome: "Lucas Andrade", categoria: "Personal trainer", cidade: "São Paulo, SP" }), foto_profissional: foto });
const troca = (a, b) => { if (!html.includes(a)) throw new Error("não achei: " + a.slice(0, 60)); html = html.replace(a, b); };
// personal fictício: a foto continua marcada como ilustrativa
troca('if(L.foto){$("#foto-ilustrativa").hidden=true; $("#hero-ilustrativa").hidden=true}', "");
troca('<h2 id="t-sobre">Treino é <span>consistência.</span></h2>', '<h2 id="t-sobre">Prazer, <span>sou o Lucas.</span></h2>');
troca('$("#sobre-txt").textContent="Acredito em treino bem feito, sem exagero e sem atalhos. O objetivo é que você saia de cada sessão mais forte e volte na próxima semana.";',
  '$("#sobre-txt").textContent="Comecei a treinar para recuperar a disposição e acabei transformando isso em profissão. Hoje ajudo pessoas com rotina corrida a treinar com segurança, sem exagero e sem atalhos, para sair de cada sessão mais fortes e voltar na próxima semana.";');
troca("Prévia demonstrativa criada para apresentação. Não é o site oficial do profissional.", "Personal fictício. Site de demonstração criado pela Diskett Labs. A foto é ilustrativa e não retrata um profissional real.");
troca("<title>", '<meta name="robots" content="noindex">\n<title>');
mkdirSync(R + "public/demos", { recursive: true });
writeFileSync(R + "public/demos/personal.html", html);
console.log("ok personal");
