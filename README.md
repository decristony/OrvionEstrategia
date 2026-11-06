# Diagnóstico Digital para Clínicas — Orvion Web

Ferramenta gratuita que você divulga nos posts do LinkedIn (CTA "Comenta CLÍNICA").
O dono da clínica responde 8 ou 9 perguntas, o site dele é testado na hora e o resultado aparece na tela.
**Você só recebe contato se a pessoa clicar em um dos três botões de WhatsApp.**

## O que a ferramenta faz

1. **Perguntas rápidas:** nome, cargo, clínica, cidade, especialidade, site, WhatsApp no site, Google Maps, avaliações, canais de pacientes, agendamento e maior desafio.
2. **Teste do site (se houver):** usa o Google PageSpeed Insights, no celular e no computador.
   - Captura da página inteira no celular (dentro de um iPhone) e no computador (dentro de um navegador).
   - Sequência de imagens do site carregando ("é isso que o paciente vê enquanto espera").
   - Nota de velocidade, tempo até o conteúdo aparecer, SEO técnico.
   - Verificações visuais: adaptado ao celular, HTTPS, layout estável, botões fáceis de tocar, texto legível, contraste, imagens pesadas, título e descrição para o Google, imagens descritas, indexação.
   - Dados reais de visitantes do Chrome, quando o Google tiver esses dados.
3. **Resultado:** nota geral de 0 a 100, três pilares (Site, Google, Captação), três prioridades e três ganhos rápidos, links para conferir a clínica no Google e no Maps, e opção de salvar em PDF.
4. **Três botões de contato:** abrem o WhatsApp do visitante com um resumo pronto do diagnóstico para o seu número. Ele decide se envia.
   - Quero melhorar minha presença digital
   - Quero aumentar minha carteira de pacientes
   - Falar com um especialista

Nada é salvo em servidor. As respostas ficam só no navegador do visitante.

## Como editar

Tudo que você precisa mudar está em `js/config.js`:

- `whatsapp`: número que recebe as mensagens (hoje: 5561998512796, o mesmo do site).
- `pagespeedApiKey`: chave da API do Google (veja abaixo).
- `ctas`: título, descrição e mensagem de cada botão.

## Chave da API do PageSpeed (recomendado, gratuito)

Sem chave a ferramenta funciona, mas o Google limita as consultas sem chave e o teste pode falhar quando muita gente usar ao mesmo tempo (por exemplo, logo depois de um post). Quando isso acontece, a ferramenta avisa e mostra o restante do diagnóstico.

1. Acesse https://developers.google.com/speed/docs/insights/v5/get-started e clique em **Get a Key**.
2. Escolha ou crie um projeto e copie a chave.
3. Cole em `pagespeedApiKey` no `js/config.js`.
4. No Google Cloud Console, em **APIs e serviços > Credenciais**, restrinja a chave ao seu domínio (restrição por "Sites" com o endereço onde a ferramenta vai ficar). Assim ninguém usa a sua cota em outro lugar.

## Como publicar

É um site estático (HTML, CSS e JS), sem servidor. Opções:

- **GitHub Pages** (como seu portfólio): crie um repositório, suba o conteúdo desta pasta e ative Pages. O link fica algo como `decristony.github.io/diagnostico`.
- **Subpasta do site da Orvion:** copie a pasta para `orvionweb.com/diagnostico/`.

Abrir o `index.html` direto pelo Windows (duplo clique) funciona para ver, mas a fonte Sora não carrega fora de um servidor. Publicado, tudo carrega normalmente.

## Como a nota é calculada

- **Site (40%)**: velocidade no celular (35 pts), SEO (25), acessibilidade (10), boas práticas (10) pelo PageSpeed, mais WhatsApp visível (20) pela resposta. Sem site: 0. Se o teste falhar, o peso vai para os outros pilares.
- **Google (35%)**: perfil no Maps (até 55) e avaliações (até 45).
- **Captação (25%)**: canais de pacientes (até 60) e forma de agendamento (até 40).

A explicação também aparece para o visitante no fim do resultado.

## Arquivos

```
index.html          Página (intro, perguntas, carregamento, resultado)
css/style.css       Visual com a identidade da Orvion
js/config.js        Número do WhatsApp, chave da API e textos dos botões
js/app.js           Perguntas, teste do PageSpeed, nota e relatório
assets/             Logo, favicon e fonte Sora (licença OFL)
```
