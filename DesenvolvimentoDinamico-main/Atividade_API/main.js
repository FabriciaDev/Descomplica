// util: remove acentos e padroniza
function normalizar(s) {
  if (s == null) return "";
  const mapa = { á:"a",à:"a",â:"a",ã:"a",ä:"a",
    é:"e",è:"e",ê:"e",ë:"e",
    í:"i",ì:"i",î:"i",ï:"i",
    ó:"o",ò:"o",ô:"o",õ:"o",ö:"o",
    ú:"u",ù:"u",û:"u",ü:"u", ç:"c" };
  return s.toLowerCase().split("").map(ch => mapa[ch] ?? ch).join("");
}

// util: evita HTML perigoso
function sanear(msg) {
  const s = String(msg ?? "").replace(/\r?\n|\r/g, " ");
  return s
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

async function consumirApiPlanejada(provedor, config) {
  const req = {
    endpoint: config?.endpoint ?? "/posts",
    metodo: config?.metodo ?? "GET",
    headers: { ...(config?.headers ?? {}) },
    payload: config?.payload ?? null
  };

  try {
    const resp = await provedor(req);

    if (!resp || resp.ok !== true) {
      const status = resp?.status ?? 0;
      return { ok: false, status, codigo: "API_FALHA", mensagem: sanear("Falha no provedor de API.") };
    }

    let posts = Array.isArray(resp.data) ? resp.data.slice() : [];

    posts = posts.filter(p => p && (p.id ?? null) !== null && typeof p.title === "string" && typeof p.body === "string");

    if (typeof config?.userId === "number") {
      posts = posts.filter(p => p.userId === config.userId);
    }
    if (config?.termo) {
      const q = normalizar(config.termo);
      posts = posts.filter(p => normalizar(p.title).includes(q) || normalizar(p.body).includes(q));
    }

    const ordenarPor = (config?.ordenarPor ?? "id").toLowerCase();
    const ordem = (config?.ordem ?? "asc").toLowerCase();
    posts = posts.map((p, i) => ({ p, i }));
    posts.sort((a, b) => {
      let c = 0;
      if (ordenarPor === "title") c = a.p.title.localeCompare(b.p.title);
      else c = (a.p.id === b.p.id) ? 0 : (a.p.id < b.p.id ? -1 : 1);
      if (ordem === "desc") c = -c;
      return c !== 0 ? c : (a.i - b.i);
    });
    posts = posts.map(x => x.p);

    if (config?.deduplicarPorId === true) {
      const vistos = new Set();
      posts = posts.filter(p => (vistos.has(p.id) ? false : (vistos.add(p.id), true)));
    }

    if (Number.isInteger(config?.limite) && config.limite > 0 && posts.length > config.limite) {
      posts = posts.slice(0, config.limite);
    }

    return { ok: true, status: resp.status ?? 200, dados: { posts, total: posts.length } };

  } catch (err) {
    const msg = sanear(err && (err.message ?? err));
    const codigo =
      /network|fetch/i.test(String(err)) ? "REDE_INDISPONIVEL" :
      /timeout/i.test(String(err)) ? "REQUISICAO_EXPIRADA" :
      "ERRO_DESCONHECIDO";
    return { ok: false, status: 0, codigo, mensagem: msg };
  }
}

const provedorFalso = async (req) => ({
  ok: true, status: 200,
  data: [
    { id: 1, userId: 1, title: "Hello API", body: "Conteúdo A" },
    { id: 2, userId: 2, title: "Capuccino", body: "Bebida quente" },
    { id: 2, userId: 2, title: "Capuccino", body: "Duplicado" }
  ]
});

(async () => {
  const resultado = await consumirApiPlanejada(provedorFalso, {
    termo: "capuccino",
    ordenarPor: "title",
    ordem: "asc",
    userId: 2,
    deduplicarPorId: true,
    limite: 5
  });
  console.log(resultado);
})();
