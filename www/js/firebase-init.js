// Função para configurar a imagem do usuário
function carregarLogoUsuario() {
    // Obtém o objeto userData do localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));
  
    // Verifica se o objeto userData e a propriedade Logo existem
    if (userData && userData.Logo) {
      // Define a imagem de fundo para o slide com a imagem do logo do usuário
      const userLogoElement = document.getElementById("userLogo");
      userLogoElement.src = userData.Logo; // Aplica a imagem de logo
    } else {
      // Caso não haja logo, aplica a imagem padrão
      const userLogoElement = document.getElementById("userLogo");
      userLogoElement.src = "img/loading.gif"; // Imagem padrão
    }
  }
  
  // Chama a função para carregar a imagem ao carregar a página
  document.addEventListener('DOMContentLoaded', carregarLogoUsuario);
  