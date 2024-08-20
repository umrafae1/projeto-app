<?php
// Dados de conexão com o banco de dados
$servername = "127.0.0.1";
$username = "root";
$password = "2003.Cleiton";
$dbname = "SENAI";

// Criar conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexão
if ($conn->connect_error) {
    die("Erro ao conectar ao banco de dados: " . $conn->connect_error);
}

// Preparar e vincular
$stmt = $conn->prepare("INSERT INTO usuarios (nome, genero, dataNascimento, cpf, rg, estadoCivil, cadastroEmpresa, email, confirmeEmail, senha, confirmeSenha, endereco, complemento, numero, cep, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssssssssssss", $nome, $genero, $dataNascimento, $cpf, $rg, $estadoCivil, $cadastroEmpresa, $email, $confirmeEmail, $senha, $confirmeSenha, $endereco, $complemento, $numero, $cep, $cidade, $estado);

// Definir parâmetros e executar
$nome = $_POST['nome'];
$genero = $_POST['genero'];
$dataNascimento = $_POST['dataNascimento'];
$cpf = $_POST['cpf'];
$rg = $_POST['rg'];
$estadoCivil = $_POST['estadoCivil'];
$cadastroEmpresa = $_POST['cadastroEmpresa'];
$email = $_POST['email'];
$confirmeEmail = $_POST['confirmeEmail'];
$senha = $_POST['senha'];
$confirmeSenha = $_POST['confirmeSenha'];
$endereco = $_POST['endereco'];
$complemento = $_POST['complemento'];
$numero = $_POST['numero'];
$cep = $_POST['cep'];
$cidade = $_POST['cidade'];
$estado = $_POST['estado'];

if ($stmt->execute()) {
    echo "Cadastro realizado com sucesso!";
} else {
    echo "Erro ao cadastrar: " . $stmt->error;
}

// Fechar a conexão
$stmt->close();
$conn->close();
?>
