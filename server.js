import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Rota principal
app.get('/', (req, res) => {
  res.send('Sistema Reino da Sorte ONLINE ✅');
});

// Rota de teste
app.get('/teste', (req, res) => {
  res.json({ ok: true, mensagem: 'API funcionando 🚀' });
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});
