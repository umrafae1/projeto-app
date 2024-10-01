function servidor(){
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3002;

// Configuração do middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2024.Brogodorio',
  database: 'SENAI'
});


// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
    return;
  }
  console.log('Conectado ao banco de dados como ID ' + connection.threadId);

  const createAdmGrupoTable = `
    CREATE TABLE IF NOT EXISTS adm_grupo (
      idadm_grupo INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
      Nome VARCHAR(45) NULL,
      DanaNasc DATE NULL,
      FotoPerfil VARCHAR(255) NULL,
      NomeEmp VARCHAR(45) NULL,
      Logo VARCHAR(255) NULL,
      Cadastro VARCHAR(50) NULL UNIQUE,
      Senha VARCHAR(255) NULL,
      Email VARCHAR(45) NULL UNIQUE,
      PRIMARY KEY (idadm_grupo)
    );
  `;

  const createFuncionariosTable = `
    CREATE TABLE IF NOT EXISTS funcionarios (
      idfuncionarios INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
      adm_grupo_idadm_grupo INTEGER UNSIGNED NOT NULL,
      Nome VARCHAR(45) NULL,
      FotoPerfil VARCHAR(255) NULL,
      DataNasc DATE NULL,
      Funcao VARCHAR(20) NULL,
      Cadastro VARCHAR(50) NULL UNIQUE,
      Senha VARCHAR(255) NULL,
      PRIMARY KEY (idfuncionarios),
      FOREIGN KEY (adm_grupo_idadm_grupo) REFERENCES adm_grupo(idadm_grupo),
      INDEX funcionarios_FKIndex1 (adm_grupo_idadm_grupo)
    );
  `;

  connection.query(createAdmGrupoTable, (err) => {
    if (err) {
      console.error('Erro ao criar tabela adm_grupo:', err);
      return;
    }
    console.log('Tabela adm_grupo criada ou já existe no banco de dados.');

    connection.query(createFuncionariosTable, (err) => {
      if (err) {
        console.error('Erro ao criar tabela funcionarios:', err);
        return;
      }
      console.log('Tabela funcionarios criada ou já existe no banco de dados.');
    });
  });
});

// Endpoint para processar o formulário
app.post('/cadastrar', upload.fields([{ name: 'Foto', maxCount: 1 }, { name: 'Logo', maxCount: 1 }]), (req, res) => {
  const { Nome, Data, Empresa, CadastroEmpresa, Email, Senha } = req.body;

  const Foto = req.files['Foto'] ? req.files['Foto'][0].path : null;
  const Logo = req.files['Logo'] ? req.files['Logo'][0].path : null;

  const sql = `INSERT INTO adm_grupo (Nome, DanaNasc, FotoPerfil, NomeEmp, Logo, Cadastro, Senha, Email)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [Nome, Data, Foto, Empresa, Logo, CadastroEmpresa, Senha, Email];

  connection.query(sql, values, (err) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send('Erro ao inserir dados');
    }
    res.send('Dados inseridos com sucesso!');
  });
});

// Endpoint para consultar dados
app.get('/consultar', (req, res) => {
  const sql = 'SELECT * FROM adm_grupo';

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao consultar dados:', err);
      return res.status(500).send('Erro ao consultar dados');
    }
    res.json(results);
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
}

servidor()