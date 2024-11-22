document.addEventListener("DOMContentLoaded", () => {
    // Recupera os dados do usuário do localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
        document.querySelector(".foto h2").innerText = userData.Nome || "Nome não disponível";
        document.querySelector(".pessoal h7:nth-child(2)").innerText = "Cadastro: " + (userData.Cadastro  || "Não informada");
        document.querySelector(".pessoal h7:nth-child(3)").innerText = "Data de Nascimento: " + (userData.DataNasc || "Não informada");
        document.querySelector(".pessoal h7:nth-child(4)").innerText = "Empresa: " + (userData.NomeEmp || "Não informada");
        document.querySelector(".pessoal h7:nth-child(5)").innerText = "Email: " + (userData.Email || "Não informado");

        // Exibe a foto de perfil, se disponível
        const fotoPerfil = document.querySelector(".imagem_perfil");
        if (userData.FotoPerfil) {
            fotoPerfil.style.backgroundImage = `url(${userData.FotoPerfil})`;
        } else {
            fotoPerfil.innerText = "Foto não disponível";
        }
    } else {
        document.querySelector(".dados h2").innerText = "Nenhum dado encontrado. Por favor, faça login.";
    }
});