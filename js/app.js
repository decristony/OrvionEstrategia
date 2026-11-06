/* ==========================================================================
   ORVION — Diagnóstico Digital para Clínicas
   Tudo roda no navegador do visitante. Nada é salvo em servidor.
   O único envio externo é o endereço do site para o Google PageSpeed Insights.
   ========================================================================== */
(function () {
  "use strict";

  const CFG = window.ORVION_CONFIG || {};
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Ícones ---------- */
  const IC = {
    arrow: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ext: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
    search: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m10.5 10.5 3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    pin: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 0 0-9 0C3.5 9.8 8 14 8 14Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="6.5" r="1.6" fill="currentColor"/></svg>'
  };

  /* ---------- Perguntas ---------- */
  const ESPECIALIDADES = ["Odontologia", "Dermatologia / Estética", "Oftalmologia", "Fisioterapia", "Psicologia / Psiquiatria", "Ginecologia / Obstetrícia", "Pediatria", "Ortopedia", "Nutrição", "Veterinária", "Clínica médica / Multiespecialidade", "Outra"];
  const CARGOS = ["Dono(a) / Sócio(a)", "Diretor(a)", "Gestor(a) / Administrador(a)", "Marketing", "Profissional da clínica", "Outro"];

  const STEPS = [
    {
      id: "perfil",
      title: "Primeiro, quem está fazendo o diagnóstico?",
      help: "Usamos seu nome só para personalizar o resultado nesta tela.",
      fields: [
        { type: "row", fields: [
          { name: "nome", label: "Seu nome", type: "text", placeholder: "Ex.: Ana Souza", required: true, autocomplete: "given-name" },
          { name: "cargo", label: "Seu cargo", type: "select", options: CARGOS, required: true }
        ] }
      ]
    },
    {
      id: "clinica",
      title: "Agora, sobre a clínica",
      help: "Com isso conseguimos ver como ela aparece nas buscas da sua cidade.",
      fields: [
        { name: "clinica", label: "Nome da clínica", type: "text", placeholder: "Ex.: Clínica Sorriso", required: true, autocomplete: "organization" },
        { type: "row", fields: [
          { name: "cidade", label: "Cidade", type: "text", placeholder: "Ex.: Brasília", required: true, autocomplete: "address-level2" },
          { name: "especialidade", label: "Especialidade principal", type: "select", options: ESPECIALIDADES, required: true }
        ] }
      ]
    },
    {
      id: "site",
      title: "A clínica tem site?",
      help: "Se tiver, testamos a velocidade, o visual no celular e o que o Google enxerga.",
      fields: [
        { name: "temSite", type: "radio", required: true, options: [
          { v: "sim", l: "Sim, tem site" },
          { v: "nao", l: "Não tem site" },
          { v: "so_insta", l: "Só Instagram / link na bio" }
        ] },
        { name: "url", label: "Endereço do site", type: "url", placeholder: "www.suaclinica.com.br", showIf: (a) => a.temSite === "sim", required: (a) => a.temSite === "sim", sub: true, inputmode: "url" }
      ]
    },
    {
      id: "whats",
      showIf: (a) => a.temSite === "sim",
      title: "No site, o botão de WhatsApp aparece logo na primeira tela?",
      help: "Sem precisar rolar a página, no celular.",
      fields: [
        { name: "whatsSite", type: "radio", required: true, options: [
          { v: "sim", l: "Sim, aparece" },
          { v: "nao", l: "Não aparece" },
          { v: "nao_sei", l: "Não sei" }
        ] }
      ]
    },
    {
      id: "gmb",
      title: "A clínica tem perfil no Google Maps?",
      help: "É o Perfil da Empresa no Google (antigo Google Meu Negócio), com endereço, horário e avaliações.",
      fields: [
        { name: "gmb", type: "radio", required: true, options: [
          { v: "sim_atual", l: "Sim, e está atualizado" },
          { v: "sim_desatual", l: "Sim, mas está desatualizado" },
          { v: "nao", l: "Não tem" },
          { v: "nao_sei", l: "Não sei" }
        ] }
      ]
    },
    {
      id: "reviews",
      showIf: (a) => a.gmb === "sim_atual" || a.gmb === "sim_desatual",
      title: "Quantas avaliações a clínica tem no Google?",
      help: "Um número aproximado já ajuda.",
      fields: [
        { name: "reviews", type: "radio", required: true, options: [
          { v: "0_10", l: "Até 10" },
          { v: "11_50", l: "De 11 a 50" },
          { v: "51_150", l: "De 51 a 150" },
          { v: "150", l: "Mais de 150" },
          { v: "nao_sei", l: "Não sei" }
        ] }
      ]
    },
    {
      id: "canais",
      title: "Hoje, de onde vêm os pacientes novos?",
      help: "Pode marcar mais de uma opção.",
      fields: [
        { name: "canais", type: "checkbox", required: true, options: [
          { v: "indicacao", l: "Indicação de pacientes" },
          { v: "instagram", l: "Instagram" },
          { v: "google", l: "Busca no Google / Maps" },
          { v: "convenio", l: "Convênio / plano de saúde" },
          { v: "anuncios", l: "Anúncios pagos" },
          { v: "outros", l: "Outros" }
        ] }
      ]
    },
    {
      id: "agenda",
      title: "Como o paciente agenda uma consulta?",
      fields: [
        { name: "agenda", type: "radio", required: true, options: [
          { v: "whatsapp", l: "Pelo WhatsApp" },
          { v: "telefone", l: "Só por telefone" },
          { v: "online", l: "Agenda online" },
          { v: "misto", l: "Um pouco de cada" }
        ] }
      ]
    },
    {
      id: "desafio",
      title: "Qual é o maior desafio da clínica hoje?",
      help: "Escolha o que mais pesa agora.",
      fields: [
        { name: "desafio", type: "radio", required: true, options: [
          { v: "poucos", l: "Poucos pacientes novos" },
          { v: "google", l: "Não aparecemos no Google" },
          { v: "visual", l: "Site antigo ou sem cara de clínica" },
          { v: "indicacao", l: "Dependemos só de indicação" },
          { v: "insta", l: "Instagram não vira agendamento" },
          { v: "outro", l: "Outro" }
        ] },
        { name: "obs", label: "Quer contar mais? (opcional)", type: "textarea", placeholder: "Ex.: abrimos uma segunda unidade e ninguém encontra o endereço novo.", sub: true }
      ]
    }
  ];

  const LABEL = {
    temSite: { sim: "Tem site", nao: "Não tem site", so_insta: "Só Instagram" },
    gmb: { sim_atual: "Perfil atualizado", sim_desatual: "Perfil desatualizado", nao: "Sem perfil", nao_sei: "Não sabe" },
    reviews: { "0_10": "até 10", "11_50": "11 a 50", "51_150": "51 a 150", "150": "mais de 150", nao_sei: "não sabe" },
    desafio: { poucos: "Poucos pacientes novos", google: "Não aparece no Google", visual: "Site antigo ou sem cara de clínica", indicacao: "Depende só de indicação", insta: "Instagram não vira agendamento", outro: "Outro" },
    agenda: { whatsapp: "WhatsApp", telefone: "Telefone", online: "Agenda online", misto: "Misto" }
  };

  /* ---------- Estado ---------- */
  const state = { answers: {}, stepIndex: 0, results: null };

  /* ---------- Navegação entre telas ---------- */
  function show(view) {
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("is-active", v.id === "view-" + view));
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  const visibleSteps = () => STEPS.filter((s) => !s.showIf || s.showIf(state.answers));

  /* ---------- Render de perguntas ---------- */
  function fieldHTML(f) {
    if (f.type === "row") return '<div class="fields fields--2">' + f.fields.map(fieldHTML).join("") + "</div>";
    const a = state.answers;
    if (f.showIf && !f.showIf(a)) return "";
    const req = typeof f.required === "function" ? f.required(a) : f.required;
    const id = "f-" + f.name;
    const val = a[f.name] == null ? "" : a[f.name];
    const wrapCls = "field" + (f.sub ? " sub-field" : "");
    const opt = req ? "" : ' <span class="opt">(opcional)</span>';

    if (f.type === "radio" || f.type === "checkbox") {
      const vals = Array.isArray(val) ? val : [val];
      return '<div class="choices" role="' + (f.type === "radio" ? "radiogroup" : "group") + '">' +
        f.options.map((o) =>
          '<label class="choice"><input type="' + f.type + '" name="' + f.name + '" value="' + esc(o.v) + '"' + (vals.includes(o.v) ? " checked" : "") + '><span>' + esc(o.l) + "</span></label>"
        ).join("") + "</div>";
    }
    if (f.type === "select") {
      return '<div class="' + wrapCls + '"><label for="' + id + '">' + esc(f.label) + opt + '</label><select id="' + id + '" name="' + f.name + '"><option value="">Selecione</option>' +
        f.options.map((o) => '<option' + (o === val ? " selected" : "") + ">" + esc(o) + "</option>").join("") + "</select></div>";
    }
    if (f.type === "textarea") {
      return '<div class="' + wrapCls + '"><label for="' + id + '">' + esc(f.label) + '</label><textarea id="' + id + '" name="' + f.name + '" placeholder="' + esc(f.placeholder || "") + '" maxlength="400">' + esc(val) + "</textarea></div>";
    }
    return '<div class="' + wrapCls + '"><label for="' + id + '">' + esc(f.label) + opt + '</label><input id="' + id + '" name="' + f.name + '" type="' + (f.type === "url" ? "text" : f.type) + '" value="' + esc(val) + '" placeholder="' + esc(f.placeholder || "") + '"' +
      (f.autocomplete ? ' autocomplete="' + f.autocomplete + '"' : "") + (f.inputmode ? ' inputmode="' + f.inputmode + '" autocapitalize="off" spellcheck="false"' : "") + ' maxlength="160"></div>';
  }

  function flatFields(step) {
    const out = [];
    step.fields.forEach((f) => (f.type === "row" ? out.push(...f.fields) : out.push(f)));
    return out;
  }

  function renderStep() {
    const steps = visibleSteps();
    if (state.stepIndex >= steps.length) state.stepIndex = steps.length - 1;
    const step = steps[state.stepIndex];
    const total = steps.length;
    const pct = Math.round((state.stepIndex / total) * 100);

    $(".quiz-progress-bar").style.width = Math.max(4, pct) + "%";
    $(".quiz-progress").setAttribute("aria-valuenow", pct);
    $("#quiz-count").textContent = "Pergunta " + (state.stepIndex + 1) + " de " + total;
    $("#quiz-step").innerHTML =
      '<div class="step"><h2>' + esc(step.title) + "</h2>" + (step.help ? '<p class="step-help">' + esc(step.help) + "</p>" : '<div style="height:18px"></div>') +
      '<div class="fields">' + step.fields.map(fieldHTML).join("") + "</div></div>";
    $("#quiz-error").textContent = "";
    $("#quiz-back").hidden = state.stepIndex === 0;
    const last = state.stepIndex === total - 1;
    const label = last ? "Ver meu diagnóstico" : "Continuar";
    $("#quiz-next .btn-label").innerHTML = "<span>" + label + "</span><span>" + label + "</span>";

    const first = $("#quiz-step input:not([type=radio]):not([type=checkbox]), #quiz-step select");
    if (first && window.matchMedia("(min-width: 700px)").matches) first.focus({ preventScroll: true });
  }

  function readStep() {
    const step = visibleSteps()[state.stepIndex];
    const form = $("#quiz-form");
    flatFields(step).forEach((f) => {
      if (f.type === "checkbox") {
        state.answers[f.name] = Array.from(form.querySelectorAll('input[name="' + f.name + '"]:checked')).map((i) => i.value);
      } else if (f.type === "radio") {
        const c = form.querySelector('input[name="' + f.name + '"]:checked');
        state.answers[f.name] = c ? c.value : "";
      } else {
        const el = form.querySelector('[name="' + f.name + '"]');
        if (el) state.answers[f.name] = el.value.trim();
      }
    });
  }

  function normalizeUrl(raw) {
    let s = String(raw || "").trim();
    if (!s) return null;
    if (!/^https?:\/\//i.test(s)) s = "https://" + s.replace(/^\/+/, "");
    try {
      const u = new URL(s);
      if (!/\.[a-z]{2,}$/i.test(u.hostname)) return null;
      if (/(^|\.)instagram\.com$|(^|\.)facebook\.com$|linktr\.ee$/i.test(u.hostname)) return "social";
      return u.href;
    } catch (e) { return null; }
  }

  function validateStep() {
    const step = visibleSteps()[state.stepIndex];
    const a = state.answers;
    for (const f of flatFields(step)) {
      if (f.showIf && !f.showIf(a)) continue;
      const req = typeof f.required === "function" ? f.required(a) : f.required;
      const v = a[f.name];
      const empty = v == null || v === "" || (Array.isArray(v) && v.length === 0);
      if (req && empty) {
        markInvalid(f.name);
        return f.type === "radio" || f.type === "checkbox" ? "Escolha uma opção para continuar." : "Preencha o campo “" + f.label + "”.";
      }
      if (f.name === "url" && a.temSite === "sim") {
        const n = normalizeUrl(v);
        if (n === "social") { markInvalid("url"); return "Esse é um perfil de rede social. Se a clínica só tem Instagram, volte e escolha “Só Instagram”."; }
        if (!n) { markInvalid("url"); return "Esse endereço não parece um site. Exemplo: www.suaclinica.com.br"; }
        a.urlNorm = n;
      }
    }
    return "";
  }

  function markInvalid(name) {
    const el = $('#quiz-step [name="' + name + '"]');
    if (!el) return;
    const wrap = el.closest(".field");
    if (wrap) wrap.classList.add("is-invalid");
    if (el.focus) el.focus();
  }

  /* ---------- PageSpeed Insights ---------- */
  async function runPSI(url, strategy) {
    const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    api.searchParams.set("url", url);
    api.searchParams.set("strategy", strategy);
    api.searchParams.set("locale", "pt_BR");
    ["PERFORMANCE", "SEO", "ACCESSIBILITY", "BEST_PRACTICES"].forEach((c) => api.searchParams.append("category", c));
    if (CFG.pagespeedApiKey) api.searchParams.set("key", CFG.pagespeedApiKey);

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 120000);
    try {
      const res = await fetch(api.href, { signal: ctrl.signal });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.error) {
        const msg = (json.error && json.error.message) || "";
        const err = new Error(msg || "HTTP " + res.status);
        err.kind = res.status === 429 || /quota|rate/i.test(msg) ? "quota" : /FAILED_DOCUMENT_REQUEST|ERRORED_DOCUMENT_REQUEST|DNS|NO_FCP|unable to (load|reach)/i.test(msg) ? "unreachable" : "generic";
        throw err;
      }
      return parsePSI(json);
    } catch (e) {
      if (e.name === "AbortError") { const t = new Error("timeout"); t.kind = "timeout"; throw t; }
      if (!e.kind) e.kind = "network";
      throw e;
    } finally { clearTimeout(timer); }
  }

  function parsePSI(json) {
    const lr = json.lighthouseResult || {};
    const audits = lr.audits || {};
    const cat = (k) => (lr.categories && lr.categories[k] && typeof lr.categories[k].score === "number" ? lr.categories[k].score : null);
    const aud = (id) => audits[id] || null;
    const thumbs = (aud("screenshot-thumbnails") && aud("screenshot-thumbnails").details && aud("screenshot-thumbnails").details.items) || [];
    return {
      perf: cat("performance"), seo: cat("seo"), a11y: cat("accessibility"), bp: cat("best-practices"),
      lcp: aud("largest-contentful-paint"), fcp: aud("first-contentful-paint"), cls: aud("cumulative-layout-shift"), tbt: aud("total-blocking-time"), si: aud("speed-index"),
      shot: aud("final-screenshot") && aud("final-screenshot").details ? aud("final-screenshot").details.data : null,
      full: lr.fullPageScreenshot && lr.fullPageScreenshot.screenshot ? lr.fullPageScreenshot.screenshot.data : null,
      thumbs: thumbs,
      finalUrl: lr.finalDisplayedUrl || lr.finalUrl || json.id,
      audits: audits,
      field: json.loadingExperience && json.loadingExperience.metrics ? json.loadingExperience : null
    };
  }

  // Resultado de uma auditoria: true (passou), false (falhou), null (não se aplica / ausente)
  function pass(r, ids, threshold) {
    if (!r) return null;
    const list = Array.isArray(ids) ? ids : [ids];
    let seen = false;
    for (const id of list) {
      const a = r.audits[id];
      if (!a || a.score == null || a.scoreDisplayMode === "notApplicable" || a.scoreDisplayMode === "manual" || a.scoreDisplayMode === "informative") continue;
      seen = true;
      if (a.score < (threshold == null ? 0.9 : threshold)) return false;
    }
    return seen ? true : null;
  }

  const secs = (a) => (a && typeof a.numericValue === "number" ? (a.numericValue / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + " s" : "—");

  /* ---------- Loading ---------- */
  function loadingSteps(hasSite) {
    const steps = [
      { id: "respostas", t: "Lendo suas respostas" },
      { id: "mobile", t: "Testando o site no celular (Google PageSpeed)", site: true },
      { id: "desktop", t: "Testando o site no computador", site: true },
      { id: "visual", t: "Capturando como o paciente vê o site", site: true },
      { id: "seo", t: "Checando o que o Google enxerga", site: true },
      { id: "montar", t: "Montando seu diagnóstico" }
    ];
    $("#loading-steps").innerHTML = steps.map((s) => '<li data-id="' + s.id + '"' + (s.site && !hasSite ? ' class="is-skipped"' : "") + ">" + esc(s.t) + (s.site && !hasSite ? " · sem site para testar" : "") + "</li>").join("");
    $("#loading-sub").textContent = hasSite ? "Isso leva de 20 a 60 segundos. Não feche esta página." : "Só um instante.";
  }
  function setStep(id, status) {
    const li = $('#loading-steps li[data-id="' + id + '"]');
    if (!li || li.classList.contains("is-skipped")) return;
    li.classList.remove("is-running", "is-done");
    li.classList.add("is-" + status);
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function analyze() {
    const a = state.answers;
    const hasSite = a.temSite === "sim" && a.urlNorm && a.urlNorm !== "social";
    loadingSteps(hasSite);
    show("loading");

    setStep("respostas", "running");
    await wait(700);
    setStep("respostas", "done");

    let mobile = null, desktop = null, psiError = null;
    if (hasSite) {
      setStep("mobile", "running");
      setStep("desktop", "running");
      const pm = runPSI(a.urlNorm, "mobile").then((r) => { setStep("mobile", "done"); setStep("visual", "running"); return r; });
      const pd = runPSI(a.urlNorm, "desktop").then((r) => { setStep("desktop", "done"); return r; });
      const [rm, rd] = await Promise.allSettled([pm, pd]);
      if (rm.status === "fulfilled") mobile = rm.value; else psiError = rm.reason;
      if (rd.status === "fulfilled") desktop = rd.value; else if (!psiError && !mobile) psiError = rd.reason;
      ["mobile", "desktop"].forEach((id) => setStep(id, "done"));
      setStep("visual", "running"); await wait(400); setStep("visual", "done");
      setStep("seo", "running"); await wait(400); setStep("seo", "done");
    }
    setStep("montar", "running");
    await wait(600);
    setStep("montar", "done");

    state.results = buildDiagnosis(a, hasSite, mobile, desktop, psiError);
    renderResult(state.results);
    show("result");
  }

  /* ---------- Diagnóstico ---------- */
  function buildDiagnosis(a, hasSite, m, d, psiError) {
    const esp = (a.especialidade || "").split(" /")[0].toLowerCase();
    const canais = a.canais || [];

    // Pilar 1: Site
    let site = null, siteNote = "";
    if (!hasSite) { site = 0; siteNote = a.temSite === "so_insta" ? "Sem site próprio. O Instagram não aparece bem no Google." : "Sem site próprio."; }
    else if (m) {
      const wa = a.whatsSite === "sim" ? 20 : a.whatsSite === "nao_sei" ? 8 : 0;
      site = Math.round((m.perf || 0) * 35 + (m.seo || 0) * 25 + (m.a11y || 0) * 10 + (m.bp || 0) * 10 + wa);
      siteNote = "Velocidade no celular, SEO, acessibilidade, boas práticas e WhatsApp visível.";
    } else { site = null; siteNote = "Não foi possível testar o site agora."; }

    // Pilar 2: Google
    const gmbPts = { sim_atual: 55, sim_desatual: 30, nao_sei: 10, nao: 0 }[a.gmb] || 0;
    const revPts = (a.gmb === "sim_atual" || a.gmb === "sim_desatual") ? ({ "150": 45, "51_150": 35, "11_50": 22, "0_10": 8, nao_sei: 5 }[a.reviews] || 0) : 0;
    const google = Math.min(100, gmbPts + revPts);

    // Pilar 3: Captação
    const chPts = { google: 30, instagram: 15, anuncios: 15, indicacao: 10, convenio: 5, outros: 5 };
    const ch = Math.min(60, canais.reduce((s, c) => s + (chPts[c] || 0), 0));
    const ag = { online: 40, whatsapp: 35, misto: 30, telefone: 15 }[a.agenda] || 0;
    const capt = Math.min(100, ch + ag);

    // Nota geral (se o teste do site falhou, o peso dele é redistribuído)
    let total;
    if (site == null) total = Math.round((google * 35 + capt * 25) / 60);
    else total = Math.round(site * 0.4 + google * 0.35 + capt * 0.25);

    /* ----- Problemas ----- */
    const P = [];
    const add = (sev, title, text) => P.push({ sev, title, text });
    if (!hasSite) add(95, "A clínica não tem site próprio", a.temSite === "so_insta"
      ? "O Instagram quase não aparece quando alguém pesquisa no Google. Quem procura “" + esp + " em " + a.cidade + "” encontra primeiro as clínicas que têm site."
      : "Quem pesquisa “" + esp + " em " + a.cidade + "” no Google encontra primeiro as clínicas que têm site. Sem ele, a captação depende de indicação e redes sociais.");
    if (a.gmb === "nao") add(92, "A clínica não aparece no Google Maps", "Nas buscas por “" + esp + " perto de mim”, o Google mostra primeiro os perfis do Maps. Sem perfil, a clínica fica de fora dessa lista.");
    if (a.gmb === "nao_sei") add(70, "Você não sabe se a clínica aparece no Google Maps", "Esse é um dos primeiros lugares onde o paciente procura. Vale conferir com os botões logo abaixo.");
    if (a.gmb === "sim_desatual") add(66, "O perfil no Google está desatualizado", "Horário, telefone ou fotos errados fazem o paciente desistir e ligar para outra clínica.");
    if (a.reviews === "0_10") add(74, "Poucas avaliações no Google", "O paciente compara clínicas pela nota e pela quantidade de avaliações. Com poucas, a clínica perde a comparação para o concorrente.");
    if (a.reviews === "11_50") add(44, "Número de avaliações ainda baixo", "Mais avaliações recentes deixam a clínica mais confiável e mais visível no Maps.");

    if (m) {
      const vp = pass(m, "viewport");
      const https = pass(m, "is-on-https");
      if (vp === false) add(90, "O site não se adapta ao celular", "O paciente precisa dar zoom para ler. A maior parte das buscas por clínicas é feita pelo celular.");
      if (https === false) add(86, "O site não tem cadeado de segurança (HTTPS)", "O navegador mostra o aviso “Não seguro”. Isso afasta o paciente antes de ele ler qualquer coisa.");
      if (m.perf != null && m.perf < 0.5) add(88, "O site é lento no celular", "O conteúdo principal leva " + secs(m.lcp) + " para aparecer. Muitos pacientes fecham a página antes disso, e o Google também considera a velocidade ao ordenar os resultados.");
      else if (m.perf != null && m.perf < 0.9) add(58, "O site pode ficar mais rápido no celular", "O conteúdo principal aparece em " + secs(m.lcp) + ". Dá para melhorar com imagens mais leves e menos scripts.");
      if (m.seo != null && m.seo < 0.8) {
        const miss = [];
        if (pass(m, "document-title") === false) miss.push("título da página");
        if (pass(m, "meta-description") === false) miss.push("descrição para o Google");
        if (pass(m, "is-crawlable") === false) miss.push("permissão para o Google indexar");
        if (pass(m, "image-alt") === false) miss.push("descrição das imagens");
        add(72, "O Google não entende bem o seu site", miss.length ? "Faltam itens básicos: " + miss.join(", ") + "." : "A nota de SEO técnico ficou em " + Math.round(m.seo * 100) + " de 100.");
      }
      if (pass(m, "cumulative-layout-shift") === false) add(48, "O layout pula enquanto carrega", "Botões e textos mudam de lugar durante o carregamento. O paciente toca no lugar errado e se irrita.");
      if (pass(m, "color-contrast") === false) add(40, "Textos com pouco contraste", "Alguns textos ficam difíceis de ler, principalmente no celular e sob luz forte.");
    }
    if (hasSite && a.whatsSite === "nao") add(80, "O WhatsApp não aparece na primeira tela do site", "O paciente quer agendar com um toque. Se precisar procurar o contato, boa parte desiste.");
    if (hasSite && a.whatsSite === "nao_sei") add(52, "Não está claro se o WhatsApp aparece no site", "Abra o site no celular e veja se o botão aparece sem rolar a página.");
    const onlyReferral = canais.length > 0 && !canais.some((c) => ["google", "instagram", "anuncios"].includes(c));
    if (onlyReferral) add(76, "A clínica depende de indicação", "Indicação é ótima, mas não dá para prever nem acelerar. Sem canal digital, a agenda oscila conforme o boca a boca.");
    else if (!canais.includes("google")) add(56, "O Google não traz pacientes hoje", "Quem procura “" + esp + " em " + a.cidade + "” está pronto para agendar. Hoje esses pacientes vão para outras clínicas.");
    if (a.agenda === "telefone") add(50, "Agendamento só por telefone", "Muitos pacientes pesquisam à noite e no fim de semana. Sem WhatsApp ou agenda online, esse contato se perde.");
    if (hasSite && a.desafio === "visual") add(62, "O visual do site não transmite a qualidade da clínica", "Você mesmo apontou isso. O site é a primeira impressão do paciente que ainda não conhece a clínica.");
    if (a.desafio === "insta" && !hasSite) add(60, "O Instagram não tem para onde levar o paciente", "Sem uma página com especialidades, endereço e WhatsApp, o seguidor curte e não agenda.");

    P.sort((x, y) => y.sev - x.sev);
    const problems = dedupe(P).slice(0, 3);

    /* ----- Ganhos rápidos ----- */
    const W = [];
    const win = (prio, title, text) => W.push({ prio, title, text });
    if (a.gmb === "nao" || a.gmb === "nao_sei") win(100, "Criar ou reivindicar o perfil no Google", "É gratuito. Cadastre endereço, horário, fotos reais da clínica e o link do WhatsApp.");
    if (a.gmb === "sim_desatual") win(95, "Atualizar o perfil do Google ainda hoje", "Confira horário, telefone, endereço e categoria. Suba fotos recentes da fachada e da recepção.");
    if (["0_10", "11_50", "nao_sei"].includes(a.reviews) || a.gmb === "nao") win(90, "Pedir avaliação depois de cada atendimento", "Envie pelo WhatsApp o link direto de avaliação do Google, no mesmo dia da consulta.");
    if (!hasSite) win(92, "Ter uma página focada em agendamento", "Uma landing page com especialidade, endereço, avaliações e botão de WhatsApp já coloca a clínica nas buscas.");
    if (hasSite && a.whatsSite !== "sim") win(88, "Colocar um botão de WhatsApp fixo no site", "Visível na primeira tela, em todas as páginas, já com uma mensagem pronta para o paciente.");
    if (m && pass(m, "meta-description") === false) win(80, "Escrever a descrição da página para o Google", "Um texto curto com especialidade, bairro e cidade. É o que aparece embaixo do título na busca.");
    if (m && pass(m, ["uses-responsive-images", "modern-image-formats", "uses-optimized-images", "image-delivery-insight"]) === false) win(78, "Deixar as imagens mais leves", "Converter as imagens para WebP e no tamanho certo. Imagens pesadas são a causa mais comum de site lento.");
    if (hasSite) win(60, "Colocar especialidade e bairro no título da página", "Ex.: “" + (a.especialidade || "Clínica").split(" /")[0] + " em " + a.cidade + " | " + a.clinica + "”. Ajuda o Google a mostrar a clínica para quem está perto.");
    if (a.agenda === "telefone") win(70, "Abrir o agendamento pelo WhatsApp", "Um número de WhatsApp Business com mensagem automática fora do horário já recupera contatos.");
    win(40, "Mostrar avaliações reais no site e no Instagram", "Prints de avaliações do Google, com autorização, aumentam a confiança de quem ainda não conhece a clínica.");
    W.sort((x, y) => y.prio - x.prio);
    const wins = dedupe(W).slice(0, 3);

    return { a, hasSite, m, d, psiError, site, siteNote, google, capt, total, problems, wins };
  }

  function dedupe(list) {
    const seen = new Set();
    return list.filter((x) => (seen.has(x.title) ? false : (seen.add(x.title), true)));
  }

  const level = (n) => (n >= 75 ? "good" : n >= 50 ? "mid" : "bad");
  const levelLabel = (n) => (n >= 75 ? "Bom" : n >= 50 ? "Precisa de atenção" : "Crítico");

  /* ---------- Render do resultado ---------- */
  function renderResult(R) {
    const a = R.a;
    const first = (a.nome || "").split(" ")[0];
    const lv = level(R.total);
    const headline = lv === "good"
      ? "A presença digital da " + esc(a.clinica) + " está <em>no caminho certo</em>"
      : lv === "mid"
        ? "A " + esc(a.clinica) + " está <em>perdendo pacientes</em> no digital"
        : "A " + esc(a.clinica) + " está <em>invisível</em> para muitos pacientes";
    const sub = lv === "good"
      ? esc(first) + ", a base está boa. Os ajustes abaixo ajudam a clínica a ganhar dos concorrentes da sua cidade."
      : esc(first) + ", encontramos pontos que hoje afastam pacientes que procuram " + esc((a.especialidade || "").split(" /")[0].toLowerCase()) + " em " + esc(a.cidade) + ". A boa notícia é que a maioria tem solução rápida.";

    let html = "";

    // Cabeçalho
    html += '<header class="r-head">' +
      '<div><p class="eyebrow"><span class="dot"></span>Diagnóstico Digital · ' + esc(a.clinica) + "</p>" +
      "<h1>" + headline + "</h1><p>" + sub + "</p></div>" +
      '<div class="r-score" role="img" aria-label="Nota geral ' + R.total + ' de 100">' +
      '<svg viewBox="0 0 120 120" class="ring"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" class="ring-fg" style="--p:0;stroke:var(--' + (lv === "good" ? "good" : lv === "mid" ? "mid" : "bad") + ')" data-p="' + R.total / 100 + '"/></svg>' +
      '<div class="r-score-num"><strong data-count="' + R.total + '">0</strong><span>de 100</span><span class="r-score-label bg-' + lv + '">' + levelLabel(R.total) + "</span></div></div>" +
      "</header>";

    // Pilares
    const pillar = (name, val, note) => {
      const nt = val == null;
      return '<div class="pillar"><div class="pillar-top"><h3>' + name + '</h3><span class="pillar-val ' + (nt ? "" : "lvl-" + level(val)) + '">' + (nt ? "—" : val + "<small>/100</small>") + "</span></div>" +
        '<div class="bar"><i data-w="' + (nt ? 0 : val) + '"></i></div><p>' + esc(note) + "</p></div>";
    };
    html += '<section class="r-section"><div class="pillars">' +
      pillar("Site", R.site, R.siteNote) +
      pillar("Google", R.google, "Perfil no Google Maps e avaliações de pacientes.") +
      pillar("Captação", R.capt, "Canais que trazem pacientes novos e facilidade para agendar.") +
      "</div></section>";

    // Problemas e ganhos
    html += '<section class="r-section"><h2>O que mais pesa hoje</h2><p class="r-sub">Os três pontos que mais afastam pacientes, e três ações rápidas para começar.</p><div class="findings">' +
      '<div class="f-col f-col--bad"><h3><i style="background:var(--bad)"></i>Prioridades</h3><ol class="f-list">' +
      (R.problems.length ? R.problems.map((p) => "<li class=\"f-item\"><b>" + esc(p.title) + "</b><p>" + esc(p.text) + "</p></li>").join("") : '<li class="f-item"><b>Nenhum problema grave encontrado</b><p>A presença digital da clínica está bem montada.</p></li>') +
      "</ol></div>" +
      '<div class="f-col f-col--good"><h3><i style="background:var(--accent)"></i>Ganhos rápidos</h3><ol class="f-list">' +
      R.wins.map((w) => "<li class=\"f-item\"><b>" + esc(w.title) + "</b><p>" + esc(w.text) + "</p></li>").join("") +
      "</ol></div></div>" +
      '<p class="jump"><a href="#cta-title" class="link-btn">Quero ajuda para resolver esses pontos ' + IC.arrow + "</a></p></section>";

    // Análise visual do site
    if (R.hasSite) html += visualSection(R);

    // Conferência no Google
    const q1 = encodeURIComponent(a.clinica + " " + a.cidade);
    const q2 = encodeURIComponent((a.especialidade || "clínica").split(" /")[0] + " em " + a.cidade);
    html += '<section class="r-section"><h2>Veja como o paciente encontra você</h2><p class="r-sub">Abra as buscas abaixo, de preferência no celular. Elas mostram o que o paciente vê ao procurar a clínica e quem aparece antes dela.</p>' +
      '<div class="gcheck"><p>Se a clínica não aparecer entre os primeiros resultados da busca por especialidade, esse paciente está indo para o concorrente.</p><div class="gcheck-actions">' +
      '<a class="pill-link" target="_blank" rel="noopener" href="https://www.google.com/search?q=' + q1 + '">' + IC.search + "Buscar a clínica</a>" +
      '<a class="pill-link" target="_blank" rel="noopener" href="https://www.google.com/maps/search/' + q1 + '">' + IC.pin + "Ver no Maps</a>" +
      '<a class="pill-link" target="_blank" rel="noopener" href="https://www.google.com/search?q=' + q2 + '">' + IC.search + "Quem aparece na minha especialidade</a>" +
      "</div></div></section>";

    // CTA
    html += '<section class="cta" aria-labelledby="cta-title"><h2 id="cta-title">Quer ajuda para resolver isso?</h2>' +
      "<p>Escolha uma opção. O WhatsApp abre com o resumo deste diagnóstico, e você decide se envia. Sem compromisso.</p>" +
      '<div class="cta-grid">' +
      (CFG.ctas || []).map((c) =>
        '<button type="button" class="cta-card' + (c.destaque ? " is-main" : "") + '" data-cta="' + esc(c.id) + '">' +
        '<span class="wa">' + IC.wa + "</span><b>" + esc(c.titulo) + "</b><small>" + esc(c.descricao) + '</small><span class="go">Abrir WhatsApp ' + IC.arrow + "</span></button>"
      ).join("") +
      '</div><p class="cta-foot">Atendimento direto com Decristony Araujo, fundador da Orvion Web.</p></section>';

    // Ferramentas e método
    html += '<div class="r-tools"><button class="btn-ghost" type="button" data-restart>' +
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8a5 5 0 1 0 1.5-3.5M3 3v2.5h2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Fazer de novo</button>' +
      '<button class="btn-ghost" type="button" data-print>' +
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 6V2.5h7V6M4.5 11.5h-2v-5h11v5h-2M4.5 9.5h7v4h-7z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>Salvar relatório em PDF</button></div>';

    html += '<details class="method"><summary>Como calculamos a nota</summary><div>' +
      "<p><b>Site (40% da nota):</b> velocidade no celular (35 pts), SEO técnico (25), acessibilidade (10) e boas práticas (10), medidos pelo Google PageSpeed Insights, mais o botão de WhatsApp visível (20), conforme sua resposta. Sem site, este pilar fica zerado. Se o teste não rodar, o peso vai para os outros pilares.</p>" +
      "<p><b>Google (35%):</b> perfil no Google Maps (até 55 pts) e quantidade de avaliações (até 45), conforme suas respostas.</p>" +
      "<p><b>Captação (25%):</b> canais que trazem pacientes (até 60 pts) e forma de agendamento (até 40), conforme suas respostas.</p>" +
      "<p>Os números do PageSpeed são de um teste feito agora, em condições simuladas de celular. Eles variam um pouco a cada teste. Esta análise não acessa dados privados da clínica.</p>" +
      "</div></details>";

    $("#result-root").innerHTML = html;
    animateResult();
  }

  function visualSection(R) {
    const m = R.m, d = R.d;
    if (!m) {
      const why = {
        quota: "O serviço de teste do Google está com muitas consultas agora.",
        unreachable: "Não conseguimos abrir o endereço " + esc(R.a.url) + ". Confira se ele está certo e no ar.",
        timeout: "O site demorou demais para responder ao teste.",
        network: "Houve uma falha de conexão durante o teste.",
        generic: "O teste do Google não retornou resultado."
      }[(R.psiError && R.psiError.kind) || "generic"];
      return '<section class="r-section"><h2>Análise do site</h2><div class="notice"><b>Não foi possível testar o site agora.</b> ' + why +
        ' O restante do diagnóstico continua válido. Você pode <button type="button" class="link-btn" data-retry>tentar de novo</button> em alguns minutos.</div></section>';
    }

    const shotM = m.full || m.shot;
    const shotD = d && (d.full || d.shot);
    const host = (() => { try { return new URL(m.finalUrl || R.a.urlNorm).hostname; } catch (e) { return R.a.url; } })();

    // Verificações visuais e técnicas
    const C = [];
    const chk = (res, ok, bad, okTxt, badTxt) => { if (res !== null) C.push(res ? { s: "ok", t: ok, d: okTxt } : { s: "bad", t: bad, d: badTxt }); };
    chk(pass(m, "viewport"), "Adaptado ao celular", "Não se adapta ao celular", "A página se ajusta à tela do telefone.", "O paciente precisa dar zoom para ler.");
    chk(pass(m, "is-on-https"), "Site seguro (HTTPS)", "Sem cadeado de segurança", "O navegador mostra o cadeado.", "O navegador exibe “Não seguro”.");
    chk(pass(m, "cumulative-layout-shift"), "Layout estável", "Layout pula ao carregar", "Os elementos não mudam de lugar.", "Botões e textos se movem durante o carregamento.");
    chk(pass(m, ["target-size", "tap-targets"]), "Botões fáceis de tocar", "Botões pequenos ou colados", "Dá para tocar sem errar.", "O paciente toca no lugar errado.");
    chk(pass(m, "font-size"), "Texto legível", "Texto pequeno demais", "Fonte com tamanho adequado no celular.", "Parte do texto exige zoom.");
    chk(pass(m, "color-contrast"), "Contraste bom", "Contraste fraco", "Textos se destacam do fundo.", "Alguns textos ficam difíceis de ler.");
    chk(pass(m, ["uses-responsive-images", "modern-image-formats", "uses-optimized-images", "image-delivery-insight"]), "Imagens otimizadas", "Imagens pesadas", "As imagens carregam no tamanho certo.", "Imagens maiores do que o necessário deixam o site lento.");
    chk(pass(m, "document-title"), "Título para o Google", "Sem título da página", "O Google sabe o nome da página.", "O Google não sabe como chamar a página.");
    chk(pass(m, "meta-description"), "Descrição para o Google", "Sem descrição para o Google", "Existe um resumo para a busca.", "O Google inventa o texto que aparece na busca.");
    chk(pass(m, "image-alt"), "Imagens descritas", "Imagens sem descrição", "O Google entende as imagens.", "O Google não entende o que as imagens mostram.");
    chk(pass(m, "is-crawlable"), "Liberado para o Google", "Bloqueado para o Google", "A página pode aparecer na busca.", "A página está bloqueada para indexação.");
    C.sort((x, y) => (x.s === y.s ? 0 : x.s === "bad" ? -1 : 1));

    const perfM = m.perf == null ? null : Math.round(m.perf * 100);
    const perfD = d && d.perf != null ? Math.round(d.perf * 100) : null;
    const metric = (label, val, note, lv) => '<div class="metric"><span>' + label + '</span><strong class="' + (lv ? "lvl-" + lv : "") + '">' + val + "</strong><small>" + note + "</small></div>";
    const lcpS = m.lcp && m.lcp.numericValue != null ? m.lcp.numericValue / 1000 : null;

    let field = "";
    if (m.field && m.field.overall_category) {
      const cat = { FAST: "rápida", AVERAGE: "média", SLOW: "lenta" }[m.field.overall_category] || "";
      if (cat) field = '<div class="notice"><b>Dados reais de visitantes:</b> segundo o Google Chrome, a experiência de quem visitou o site nos últimos 28 dias foi considerada <b>' + cat + "</b>.</div>";
    }

    let html = '<section class="r-section"><h2>Como o paciente vê o seu site</h2><p class="r-sub">Imagens capturadas agora pelo Google PageSpeed, como se fosse um paciente acessando ' + esc(host) + ". Role dentro do celular para ver a página inteira.</p>";
    html += '<div class="visual"><div>' +
      (shotM ? '<div class="device-phone"><div class="device-screen"><img src="' + shotM + '" alt="Captura do site no celular"></div></div><p class="device-caption">Celular</p>' : "") +
      '</div><div class="visual-side">';
    if (shotD) html += '<div class="device-browser"><div class="browser-bar"><i></i><i></i><i></i><span>' + esc(host) + '</span></div><div class="browser-screen"><img src="' + shotD + '" alt="Captura do site no computador"></div></div>';
    if (m.thumbs && m.thumbs.length) {
      html += '<div class="filmstrip-wrap"><h3>O site carregando no celular</h3><p>É isso que o paciente vê enquanto espera.</p><div class="filmstrip">' +
        m.thumbs.map((t) => '<figure><img src="' + t.data + '" alt=""><figcaption>' + (t.timing / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + " s</figcaption></figure>").join("") +
        "</div></div>";
    }
    html += "</div></div>";

    html += '<div class="r-section"><div class="metrics">' +
      metric("Velocidade no celular", perfM == null ? "—" : perfM + "/100", "Nota do Google", perfM == null ? "" : level(perfM)) +
      metric("Velocidade no computador", perfD == null ? "—" : perfD + "/100", "Nota do Google", perfD == null ? "" : level(perfD)) +
      metric("Conteúdo principal aparece em", secs(m.lcp), "No celular, rede 4G simulada", lcpS == null ? "" : lcpS <= 2.5 ? "good" : lcpS <= 4 ? "mid" : "bad") +
      metric("SEO técnico", m.seo == null ? "—" : Math.round(m.seo * 100) + "/100", "O que o Google lê da página", m.seo == null ? "" : level(Math.round(m.seo * 100))) +
      "</div></div>";
    if (field) html += '<div class="r-section">' + field + "</div>";

    if (C.length) {
      html += '<div class="r-section"><div class="checks">' + C.map((c) =>
        '<div class="check"><span class="check-ic ' + (c.s === "ok" ? "bg-good" : "bg-bad") + '">' + (c.s === "ok" ? "✓" : "!") + "</span><div><b>" + esc(c.t) + "</b><small>" + esc(c.d) + "</small></div></div>"
      ).join("") + "</div></div>";
    }
    html += "</section>";
    return html;
  }

  function animateResult() {
    requestAnimationFrame(() => {
      document.querySelectorAll("[data-p]").forEach((el) => el.style.setProperty("--p", el.dataset.p));
      document.querySelectorAll("[data-w]").forEach((el) => (el.style.width = el.dataset.w + "%"));
      document.querySelectorAll("[data-count]").forEach((el) => {
        const to = +el.dataset.count, t0 = performance.now(), dur = 1200;
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / dur);
          el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    });
  }

  /* ---------- WhatsApp ---------- */
  function whatsappLink(ctaId) {
    const R = state.results, a = R.a;
    const cta = (CFG.ctas || []).find((c) => c.id === ctaId) || {};
    const lines = [
      cta.mensagem || "Olá! Fiz o Diagnóstico Digital.",
      "",
      "*Resumo do diagnóstico*",
      "Nome: " + a.nome + " (" + a.cargo + ")",
      "Clínica: " + a.clinica + " · " + a.cidade,
      "Especialidade: " + a.especialidade,
      "Site: " + (R.hasSite ? a.urlNorm : LABEL.temSite[a.temSite]),
      "Nota geral: " + R.total + "/100 (Site " + (R.site == null ? "não testado" : R.site) + " · Google " + R.google + " · Captação " + R.capt + ")"
    ];
    if (R.problems.length) {
      lines.push("", "*Prioridades encontradas*");
      R.problems.forEach((p, i) => lines.push(i + 1 + ". " + p.title));
    }
    lines.push("", "Maior desafio: " + (LABEL.desafio[a.desafio] || "-"));
    if (a.obs) lines.push("Observação: " + a.obs);
    return "https://wa.me/" + String(CFG.whatsapp || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  /* ---------- Eventos ---------- */
  function restart() {
    state.answers = {}; state.stepIndex = 0; state.results = null;
    show("intro");
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-start],[data-restart],[data-print],[data-cta],[data-retry]");
    if (!t) return;
    if (t.matches("[data-start]")) { state.stepIndex = 0; renderStep(); show("quiz"); }
    else if (t.matches("[data-restart]")) { e.preventDefault(); restart(); }
    else if (t.matches("[data-print]")) window.print();
    else if (t.matches("[data-retry]")) analyze();
    else if (t.matches("[data-cta]")) {
      const url = whatsappLink(t.dataset.cta);
      const w = window.open(url, "_blank", "noopener");
      if (!w) location.href = url;
    }
  });

  // Mostrar/ocultar o campo de URL ao escolher a opção
  $("#quiz-form").addEventListener("change", (e) => {
    const step = visibleSteps()[state.stepIndex];
    if (e.target.matches("input[type=radio]")) {
      readStep();
      const hasDependent = flatFields(step).some((f) => f.showIf);
      if (hasDependent) {
        renderStep();
        const dep = $("#quiz-step input[type=text]");
        if (dep) dep.focus();
      }
    }
    const wrap = e.target.closest(".field");
    if (wrap) wrap.classList.remove("is-invalid");
    $("#quiz-error").textContent = "";
  });

  $("#quiz-form").addEventListener("submit", (e) => {
    e.preventDefault();
    readStep();
    const err = validateStep();
    if (err) { $("#quiz-error").textContent = err; return; }
    const steps = visibleSteps();
    if (state.stepIndex < steps.length - 1) { state.stepIndex++; renderStep(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else analyze();
  });

  $("#quiz-back").addEventListener("click", () => {
    readStep();
    if (state.stepIndex > 0) { state.stepIndex--; renderStep(); }
  });

  // Init
  $("#year").textContent = new Date().getFullYear();
  if (CFG.siteUrl) $("#nav-site").href = CFG.siteUrl;
  else $("#nav-site").remove();
})();
