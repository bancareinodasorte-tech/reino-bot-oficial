import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// memória simples
let clientes = {};

const PRECO = 2;
const PIX_CHAVE = '88994943632';

// gerar pix simples com valor
function gerarMensagemPix(valor) {
  return `💰 Total: R$ ${valor}

🔐 PIX:
Chave: ${PIX_CHAVE}

⚠️ Pague exatamente o valor acima.
Após pagar, envie o comprovante.`;
}

// fluxo principal
function fluxo(numero, msg) {

  if (!clientes[numero]) {
    clientes[numero] = { etapa: 'inicio' };
  }

  let c = clientes[numero];

  // iniciar
  if (c.etapa === 'inicio') {
    c.etapa = 'quantidade';
    return `🍀 REINO DA SORTE 🍀

Quantos bilhetes deseja comprar?

Cada bilhete custa R$ 2,00`;
  }

  // quantidade
  if (c.etapa === 'quantidade') {

    const num = msg.match(/\d+/);
    const qtd = num ? parseInt(num[0]) : 0;

    if (!qtd || qtd <= 0) {
      return 'Digite a quantidade de bilhetes (ex: 5)';
    }

    const valor = qtd * PRECO;

    c.qtd = qtd;
    c.valor = valor;
    c.etapa = 'pagamento';

    return gerarMensagemPix(valor);
  }

  // comprovante
  if (c.etapa === 'pagamento') {
    c.etapa = 'dados';

    return `📄 Comprovante recebido!

Agora envie:

NOME:
TELEFONE:`;
  }

  // dados
  if (c.etapa === 'dados') {

    delete clientes[numero];

    return `✅ Pedido enviado para o atendente.

🍀 Boa sorte!`;
  }

  return 'Erro no fluxo.';
}

// rota simulação
app.get('/simular', (req, res) => {

  const numero = req.query.numero || '1';
  const msg = req.query.msg || '';

  const resposta = fluxo(numero, msg);

  res.json({
    cliente: numero,
    mensagem: msg,
    resposta
  });
});

// rota principal
app.get('/', (req, res) => {
  res.send('BOT REINO ONLINE ✅');
});

app.listen(PORT, () => {
  console.log('Servidor rodando');
});
