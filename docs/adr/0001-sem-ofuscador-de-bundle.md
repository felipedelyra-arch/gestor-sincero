# 0001 Sem ofuscador de bundle

Data: 2026-11-15. Estado: aceita.

O briefing pede "ofuscação leve do bundle cliente". Decisão: usar só a minificação de produção do Next.js, sem source maps públicos, e não adicionar ofuscador.

Motivo: nenhum segredo vai para o navegador (arquitetura BFF), então ofuscar não protege nada; um ofuscador aumenta o JavaScript, piora o LCP (meta abaixo de 2,5 s) e acrescenta uma dependência de build à cadeia de suprimentos.

Custo aceito: o código do cliente fica legível para quem desminificar. Revisar se um dia houver lógica proprietária no navegador.
