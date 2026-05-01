import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

let conversas = {};

// FUNÇÃO PIX SIMPLES (simulação agora - depois ligamos no PagBank)
function gerarPix(valor) {
  return `PIX-COPIA-E-COLA-VALOR-${valor}`;
}

// Rota principal
app.get('/', (req, res) => {
  res.send('Sistema Reino da Sorte ONLINE ✅');
});

// Rota teste
app.get('/teste', (req, res) => {
  res.json({ ok: true });
});

// SIMULADOR
app.get('/simular', (req, res) => {
  const numero = req.query.numero || 'cliente1';
  const mensagem = req.query.msg || '';

  let estado = conversas[numero] || { etapa: 'inicio' };
  let resposta = '';

  if (estado.etapa === 'inicio') {
    resposta = '🎟️ Quantos bilhetes você deseja comprar?';
    estado.etapa = 'quantidade';
  }

  else if (estado.etapa === 'quantidade') {
    const qtd = parseInt(mensagem);

    if (!qtd || qtd <= 0) {
      resposta = 'Digite um número válido de bilhetes.';
    } else {
      const valor = qtd * 2;

      estado.qtd = qtd;
      estado.valor = valor;

      const pix = gerarPix(valor);

      resposta =
`💰 Total: R$ ${valor}

🔐 PIX (copia e cola):
${pix}

Após pagar, envie o comprovante.`;

      estado.etapa = 'aguardando_pagamento';
    }
  }

  else if (estado.etapa === 'aguardando_pagamento') {
    resposta =
`📄 Comprovante recebido!

Agora envie seus dados:

NOME:
TELEFONE:`;

    estado.etapa = 'dados';
  }

  else if (estado.etapa === 'dados') {
    resposta =
`✅ Pedido em análise.

Um atendente vai finalizar sua compra.

🍀 Reino da Sorte agradece sua compra!`;
    
    delete conversas[numero]; // encerra conversa
  }

  conversas[numero] = estado;

  res.json({
    cliente: numero,
    mensagem_recebida: mensagem,
    resposta,
    estado
  });
});

// Webhook (futuro WhatsApp)
app.post('/webhook', (req, res) => {
  console.log('Recebido:', req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});
