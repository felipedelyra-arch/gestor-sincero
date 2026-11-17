import type { PaginaEntrada } from "./schema";

// Documentos legais (/privacidade e /termos). Razão social, CNPJ, encarregado, prazos e foro dependem do Ferrér.
// Contatos não entram aqui: o texto aponta para os contatos oficiais do rodapé (config/site.ts).

const atualizadoEm = "Atualizado em 15 de novembro de 2026";

export const legal: PaginaEntrada["legal"] = {
  privacidade: {
    titulo: "Política de privacidade",
    atualizadoEm,
    secoes: [
      {
        titulo: "Quem trata os seus dados",
        paragrafos: [
          "Esta página pertence ao Gestor Sincero, marca de Sidney Ferrér, operada pela empresa indicada no rodapé. Ela é a controladora dos seus dados pessoais, nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018).",
          "Controladora: [PENDENTE FERRÉR: razão social, CNPJ e endereço].",
          "Encarregado pelo tratamento de dados: [PENDENTE FERRÉR: nome]. Para falar com ele, use os contatos oficiais que aparecem no rodapé desta página.",
        ],
      },
      {
        titulo: "Quais dados coletamos",
        paragrafos: [
          "Na inscrição da Jornada Executiva: nome, WhatsApp, e-mail e, se você quiser informar, empresa e cargo.",
          "No pedido da Ressonância Digital: nome, WhatsApp, e-mail, empresa, segmento, faixa de faturamento, número de funcionários e o principal desafio que você descrever. Não pedimos dado de cliente, de funcionário nem senha.",
          "Junto com qualquer formulário: as escolhas de consentimento que você marcou, a origem da visita (parâmetros de campanha e código de parceiro, quando houver) e a versão da página que você viu.",
          "Para proteger os formulários contra robôs, usamos uma verificação automática da Cloudflare e guardamos o endereço de internet (IP) apenas em forma de código irreversível, para limitar tentativas repetidas.",
          "Cookies de medição só são gravados se você aceitar no aviso de cookies.",
        ],
      },
      {
        titulo: "Para que usamos e com qual base legal",
        paragrafos: [
          "Entregar o que você pediu: liberar o manual, enviar o acesso e os avisos das reuniões da Jornada e responder ao pedido da Ressonância. Base legal: procedimentos preliminares a um contrato, a pedido do titular (art. 7º, V).",
          "Enviar conteúdos, convites e ofertas por WhatsApp ou por e-mail. Base legal: seu consentimento (art. 7º, I), dado em separado para cada canal. Você pode retirá-lo a qualquer momento.",
          "Medir visitas e anúncios com ferramentas da Meta e do Google. Base legal: seu consentimento no aviso de cookies (art. 7º, I).",
          "Proteger a página contra fraude, robôs e abuso. Base legal: legítimo interesse (art. 7º, IX), sempre com o mínimo de dados necessário.",
          "Guardar o registro dos consentimentos e cumprir obrigações legais. Base legal: cumprimento de obrigação legal e exercício regular de direitos (art. 7º, II e VI).",
        ],
      },
      {
        titulo: "Com quem compartilhamos",
        paragrafos: [
          "Não vendemos nem alugamos seus dados. Eles passam apenas por empresas que prestam serviço para esta página, chamadas de operadoras, e que só podem usá-los para essa finalidade.",
          "Hospedagem da página (Vercel), banco de dados (Supabase) e verificação contra robôs (Cloudflare).",
          "Na conversa com o personagem do Gestor Sincero, se você escrever no campo de explicação, o texto é enviado a um serviço de inteligência artificial (Groq, nos Estados Unidos) só para ser lido e encaixado em uma das respostas. Esse texto não é guardado por nós. O serviço não o usa para treinar modelos e pode mantê-lo por até 30 dias apenas para investigar falha ou abuso.",
          "Ferramenta de envio de e-mail e de WhatsApp da S4 Marketing Digital de Resultados: [PENDENTE FERRÉR: nome do fornecedor].",
          "Meta e Google, apenas se você aceitar os cookies de medição. Nesse caso, e-mail e telefone seguem em forma de código irreversível, junto da identificação do seu navegador.",
          "Plataforma de pagamento da mentoria, quando você decide comprar: [PENDENTE FERRÉR: nome da plataforma]. A compra segue também a política dessa plataforma.",
        ],
      },
      {
        titulo: "Transferência para fora do Brasil",
        paragrafos: [
          "Alguns desses fornecedores mantêm servidores fora do país. A transferência acontece só com empresas que oferecem proteção compatível com a LGPD, como permite o artigo 33 da lei.",
        ],
      },
      {
        titulo: "Por quanto tempo guardamos",
        paragrafos: [
          "Dados de inscrição e de pedido de diagnóstico: [PENDENTE FERRÉR: prazo], ou até você pedir a exclusão.",
          "Registros de consentimento: pelo tempo necessário para comprovar que você autorizou o contato, mesmo depois de revogado.",
          "Código do endereço de internet usado contra robôs: cerca de 10 minutos, só para controlar as tentativas. O mesmo código fica guardado junto do registro de consentimento e do registro de auditoria, pelo prazo desses registros.",
          "Terminado o prazo, os dados são apagados ou tornados anônimos.",
        ],
      },
      {
        titulo: "Como protegemos",
        paragrafos: [
          "A página funciona só com conexão segura (HTTPS). Telefone e e-mail ficam cifrados no banco de dados, e o acesso é restrito à equipe que precisa deles para atender você.",
          "O navegador nunca grava direto no banco: todo envio passa por uma camada no servidor que confere os dados antes de guardar.",
        ],
      },
      {
        titulo: "Seus direitos",
        paragrafos: [
          "Você pode, a qualquer momento, pedir: confirmação de que tratamos seus dados, acesso a eles, correção, anonimização, bloqueio ou eliminação do que for desnecessário, portabilidade, informação sobre com quem compartilhamos, revogação do consentimento e oposição a um tratamento (art. 18).",
          "Para isso, fale com o encarregado pelos contatos oficiais do rodapé. Respondemos em até 15 dias.",
          "Se a resposta não resolver, você pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).",
        ],
      },
      {
        titulo: "Cookies",
        paragrafos: [
          "Cookies são pequenos arquivos que a página grava no seu navegador.",
          "Os essenciais guardam, por exemplo, a sua escolha no aviso de cookies e a origem da visita. Sem eles a página não funciona direito.",
          "Os de medição (Pixel da Meta e Google Analytics) mostram de onde vêm as visitas e quais anúncios funcionam. Só entram com o seu aceite, e você pode mudar de ideia apagando os cookies do navegador.",
        ],
      },
      {
        titulo: "Menores de idade",
        paragrafos: ["Esta página é dirigida a empresários e executivos adultos. Não coletamos, de propósito, dados de menores de 18 anos."],
      },
      {
        titulo: "Mudanças nesta política",
        paragrafos: [
          "Podemos atualizar este texto quando a página ou a lei mudarem. A data da última versão fica sempre no topo.",
        ],
      },
    ],
  },

  termos: {
    titulo: "Termos de uso",
    atualizadoEm,
    secoes: [
      {
        titulo: "Sobre esta página",
        paragrafos: [
          "Esta página apresenta o Gestor Sincero, marca de Sidney Ferrér, e os programas ligados a ela. É operada pela empresa indicada no rodapé: [PENDENTE FERRÉR: razão social e CNPJ].",
          "Ao usar a página ou enviar um formulário, você concorda com estes termos e com a política de privacidade.",
        ],
      },
      {
        titulo: "Educação executiva, sem promessa de resultado",
        paragrafos: [
          "O conteúdo do Gestor Sincero é educação executiva. Ele orienta decisões, mas não substitui consultoria jurídica, contábil ou financeira.",
          "Nenhum material, reunião ou diagnóstico garante aumento de vendas, de lucro ou de faturamento. O resultado depende da aplicação e das condições de cada empresa.",
        ],
      },
      {
        titulo: "Manual e Jornada Executiva",
        paragrafos: [
          "O manual Gestão Sem Maquiagem é para uso pessoal de quem se inscreveu. Não é permitido revender, redistribuir ou publicar o arquivo.",
          "Datas e horários da Jornada Executiva aparecem nesta página e podem mudar. Qualquer mudança é avisada a quem se inscreveu, pelos canais que autorizou.",
        ],
      },
      {
        titulo: "Mentoria Empresas do Futuro",
        paragrafos: [
          "A compra é feita em plataforma de pagamento de terceiros, com as condições de valor e parcelamento mostradas no momento da compra.",
          "Você tem 7 dias, contados da compra, para desistir e receber o valor pago de volta, como prevê o artigo 49 do Código de Defesa do Consumidor.",
          "O acesso à área de membros é pessoal. Os bônus para pessoas da equipe seguem as regras informadas na oferta.",
        ],
      },
      {
        titulo: "Ressonância Digital",
        paragrafos: [
          "Enviar o pedido não cria obrigação de contratar, nem para você nem para a S4 Marketing Digital de Resultados. Valor, escopo e prazo do diagnóstico são combinados em proposta própria.",
          "As imagens de prévia nesta página são simulações com dados fictícios. Não representam nenhuma empresa real.",
        ],
      },
      {
        titulo: "Propriedade intelectual",
        paragrafos: [
          "Textos, marcas, método, imagens e materiais desta página pertencem aos seus titulares. Não podem ser copiados ou usados para fins comerciais sem autorização por escrito.",
        ],
      },
      {
        titulo: "Uso adequado",
        paragrafos: [
          "Não é permitido enviar dados de outra pessoa sem autorização, usar robôs nos formulários ou tentar interferir no funcionamento da página.",
        ],
      },
      {
        titulo: "Mudanças e lei aplicável",
        paragrafos: [
          "Estes termos podem ser atualizados. A data da última versão fica sempre no topo.",
          "Valem as leis brasileiras. Fica eleito o foro de [PENDENTE FERRÉR: comarca], sem prejuízo do direito do consumidor de recorrer ao foro do seu domicílio.",
        ],
      },
    ],
  },
};
