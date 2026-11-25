const d = document.getElementById("app")?.dataset ?? {};
const link = (v?: string) => (v && /^https?:\/\//i.test(v) ? v : "");

export const lead = {
  nome: (d.nome ?? "").split("|")[0].trim() || "Consultório",
  cidade: d.cidade ?? "",
  endereco: d.endereco ?? "",
  telefone: d.telefone ?? "",
  whatsapp: link(d.whatsapp),
  maps: link(d.maps),
  foto: link(d.foto),
  ano: d.ano ?? "",
};

/** Caminho local vira o da pasta do modelo; PNG foi convertido para JPG. */
export const asset = (src: string) =>
  src.startsWith("/") ? "/modelos/psicologia" + src.replace(/\.png$/, ".jpg") : src;
