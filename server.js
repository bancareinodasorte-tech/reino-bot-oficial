import express from 'express';

const app = express();
app.use(express.json());

const PORT = 3000;

// "banco" em memória (depois vamos trocar por banco real)
const atendimentos = {};

// preço fixo
const PRECO = 2;

// função de resposta
function responder(numero, mensagem) {
  return {
    numero,
    mensagem
  };
}

// fluxo principal
function processarMensagem(numero, texto) {
  if (!atendimentos[numero]) {
    atendimentos[numero] = {
      etapa: 'INICIO',
      quantidade: 0,
      valor: 0
    };
  }

  const cliente = atendimentos[numero];

  // FORA DO FLUXO
  if (
    cliente.etapa !== 'AGUARDANDO_COMPROVANTE' &&
    cliente.etapa !== 'AGUARDANDO_DADOS' &&
    isNaN(texto)
  ) {
    cliente.etapa = 'AGUARDANDO_QUANTIDADE';
    return responder(numero,
`🍀 REINO DA SORTE 🍀

Informe a quantidade de bilhetes desejada.

Cada bilhete custa R$ 2,00.

Exemplo:
5`);
  }

  // QUANTIDADE
  if (cliente.etapa === 'INICIO' || cliente.etapa === 'AGUARDANDO_QUANTIDADE') {
    const qtd = Number(texto);

    if (!qtd || qtd <= 0) {
      return responder(numero, 'Digite apenas um número válido.');
    }

    cliente.quantidade = qtd;
    cliente.valor = qtd * PRECO;
    cliente.etapa = 'AGUARDANDO_COMPROVANTE';

    return responder(numero,
`Pedido iniciado ✅

Quantidade: ${qtd} bilhetes
Valor total: R$ ${cliente.valor}

Faça o pagamento via PIX e envie o comprovante aqui.`);
  }

  // COMPROVANTE
  if (cliente.etapa === 'AGUARDANDO_COMPROVANTE') {
    cliente.etapa = 'AGUARDANDO_DADOS';

    return responder(numero,
`Pagamento recebido para conferência ✅

Agora envie seus dados:

NOME:
TELEFONE:`);
  }

  // DADOS
  if (cliente.etapa === 'AGUARDANDO_DADOS') {
    cliente.dados = texto;
    cliente.etapa = 'FINALIZADO';

    return responder(numero,
`Dados recebidos ✅

Aguarde o envio dos seus bilhetes.

🍀 Boa sorte! 🍀`);
  }

  return responder(numero, 'Fluxo finalizado.');
}

// rota de teste
app.post('/mensagem', (req, res) => {
  const { numero, texto } = req.body;

  const resposta = processarMensagem(numero, texto);

  res.json(resposta);
});

app.get('/', (req, res) => {
  res.send('Sistema Reino da Sorte ONLINE ✅');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
