const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});
const prisma = new PrismaClient({ adapter });

prisma.$connect()
  .then(() => console.log('Banco de dados conectado com sucesso!'))
  .catch((erro) => console.error('Erro ao conectar ao banco de dados:', erro));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API SMT Cajuína Puro Sabor funcionando!'
  });
});

app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha,
        tipo: tipo || 'CLIENTE'
      }
    });

     res.status(201).json(usuario);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      mensagem: 'Erro ao cadastrar usuário'
    });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();

    res.json(usuarios);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      mensagem: 'Erro ao buscar usuários'
    });
  }
});

app.listen(PORT, () => {
  console.log(`API executando na porta ${PORT}`);
});