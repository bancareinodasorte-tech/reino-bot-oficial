import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Banco simples em memória (controle de conversa)
let conversas = {};

// Rota principal
app.get('/', (req, res) => {
  res.send('Sistema Reino da Sorte ONLINE ✅');
});

// Rota teste
app.get('/teste', (req, res) => {
  res.json({ ok: true });
});

// Rota de simulação (TESTAR BOT SEM WHATSAPP)
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

      resposta = `💰 Total: R$ ${valor}\n\nFaça o pagamento via PIX e envie o comprovante.`;
      estado.etapa = 'aguardando_pagamento';
    }
  }

  else if (estado.etapa === 'aguardando_pagamento') {
    resposta = '📄 Envie seu comprovante para continuar.';
  }

  conversas[numero] = estado;

  res.json({
    cliente: numero,
    mensagem_recebida: mensagem,
    resposta: resposta,
    estado: estado
  });
});

// Webhook (para usar depois com WhatsApp)
app.post('/webhook', (req, res) => {
  console.log('Recebido:', req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});
