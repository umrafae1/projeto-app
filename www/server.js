const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 3007;

// Configurando o multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Altere para o diretório que você deseja usar
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nome do arquivo com timestamp
    }
});

const upload = multer({ storage: storage });

// Conexão com o banco de dados
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'corpinfo',
    password: 'corpinfo',
    database: 'corpinfo', // Altere para o nome do seu banco de dados
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Criação da tabela 'funcionarios' caso não exista
const createTableSQL = `
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

connection.query(createTableSQL, (error) => {
    if (error) {
        console.error('Erro ao criar tabela:', error);
    } else {
        console.log('Tabela "funcionarios" criada ou já existe.');
    }
});

// Rota para cadastro de funcionário
app.post('/api/cadastrarFuncionario', upload.single('FotoPerfil'), (req, res) => {
    const { Nome, DataNasc, Funcao, Cadastro, Senha } = req.body;
    const FotoPerfil = req.file.filename; // Obtendo o nome do arquivo enviado

    const sql = 'INSERT INTO funcionarios (Nome, DataNasc, Funcao, Cadastro, Senha, FotoPerfil, adm_grupo_idadm_grupo) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const admGrupoId = 1; // Substitua isso pelo ID real do grupo administrador

    connection.query(sql, [Nome, DataNasc, Funcao, Cadastro, Senha, FotoPerfil, admGrupoId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Erro ao cadastrar' });
        }
        res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
