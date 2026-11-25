// Gera os sites de demonstração (restaurantes fictícios) a partir do modelo Restaurante.
// Uso: node modelos/gerar-demos.mjs  →  public/demos/*.html
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
const R = new URL("..", import.meta.url).pathname;
const { preencher, valoresDoNegocio } = await import(R + "src/lib/modelos.ts");
const modelo = readFileSync(R + "modelos/restaurante.html", "utf8");
const demos = [
  ["pizzaria", { nome: "Nonna Bianca", categoria: "Pizzaria" }],
  ["hamburgueria", { nome: "Brasa Smash", categoria: "Hamburgueria" }],
  ["japones", { nome: "Umami Kaze", categoria: "Restaurante japonês" }],
];
mkdirSync(R + "public/demos", { recursive: true });
for (const [arquivo, n] of demos) {
  let html = preencher(modelo, { ...valoresDoNegocio({ ...n, cidade: "São Paulo, SP" }), foto_restaurante: "", ifood_link: "" });
  html = html
    .replace("Prévia demonstrativa criada para apresentação. Não é o site oficial do restaurante.", "Restaurante fictício. Site de demonstração criado pela Diskett Labs.")
    .replace("<title>", '<meta name="robots" content="noindex">\n<title>');
  writeFileSync(`${R}public/demos/${arquivo}.html`, html);
  console.log("ok", arquivo);
}
