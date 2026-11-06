/* ==========================================================================
   CONFIGURAÇÃO — edite só este arquivo
   ========================================================================== */
window.ORVION_CONFIG = {
  // Número que recebe as mensagens (DDI + DDD + número, só dígitos)
  whatsapp: "5561998512796",

  // Chave gratuita da API PageSpeed Insights (Google Cloud).
  // Sem chave o teste funciona, mas o Google limita as consultas e pode falhar
  // em dias de muito acesso. Como criar: veja o README.md.
  pagespeedApiKey: "",

  // Site institucional (usado no rodapé)
  siteUrl: "https://orvionweb.com",

  // Botões de contato exibidos no resultado.
  // "mensagem" é o texto que abre no WhatsApp do visitante, antes do resumo.
  ctas: [
    {
      id: "presenca",
      titulo: "Quero melhorar minha presença digital",
      descricao: "Site, Google e Instagram trabalhando juntos para a clínica.",
      mensagem: "Olá, Decristony! Fiz o Diagnóstico Digital e quero melhorar a presença digital da minha clínica.",
      destaque: true
    },
    {
      id: "pacientes",
      titulo: "Quero aumentar minha carteira de pacientes",
      descricao: "Plano para atrair pacientes novos pelo Google e pelo site.",
      mensagem: "Olá, Decristony! Fiz o Diagnóstico Digital e quero atrair mais pacientes para a minha clínica."
    },
    {
      id: "especialista",
      titulo: "Falar com um especialista",
      descricao: "Conversa de 20 minutos para revisar o diagnóstico com você.",
      mensagem: "Olá, Decristony! Fiz o Diagnóstico Digital e quero conversar com um especialista sobre o resultado."
    }
  ]
};
