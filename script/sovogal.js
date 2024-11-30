document.addEventListener("DOMContentLoaded", () => {
  const symbols = document.querySelectorAll(".interactive"); // Todos os símbolos com a classe 'interactive'
  const menu = document.getElementById("context-menu");
  const infoSubmenu = document.getElementById("info-submenu");
  const animationSubmenu = document.getElementById("animation-submenu");
  const infoContent = document.getElementById("info-content");
  const animationContent = document.getElementById("animation-content");
  const clickedSymbol = document.getElementById("clicked-symbol");

  let timer;
  let menuIsOpen = false; // Variável de controle para saber se o menu está aberto

  symbols.forEach(symbol => {
    symbol.addEventListener("mousedown", (event) => {
      timer = setTimeout(() => {
        showMenu(event, symbol); // Aciona o menu após 500ms
      }, 500); // Clique longo
    });

    symbol.addEventListener("mouseup", () => clearTimeout(timer)); // Cancela o temporizador ao soltar o botão do mouse
    symbol.addEventListener("mouseleave", () => clearTimeout(timer)); // Cancela ao sair do elemento
  });

  function showMenu(event, symbol) {
    event.preventDefault(); // Impede o comportamento padrão do clique direito
    menuIsOpen = true; // Marca que o menu está aberto
    menu.style.display = "block";
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;

    // Limpa submenus ao abrir o menu principal
    infoSubmenu.style.display = "none";
    animationSubmenu.style.display = "none";

    // Captura o símbolo atual clicado (atualiza dinamicamente no evento)
    const symbolText = symbol.textContent.trim(); // Pega o texto diretamente do símbolo
    clickedSymbol.textContent = symbolText;

    // Passa referência do som associado (se necessário)
    const soundData = symbol.dataset.sound || ''; // Usando data-sound, se houver
    menu.dataset.targetSound = soundData;

    console.log(`Símbolo clicado: ${symbolText}, Som associado: ${soundData}`);
  }

  // Fecha o menu ao clicar fora dele
  document.addEventListener("click", (event) => {
    if (menuIsOpen && !menu.contains(event.target) && !event.target.closest(".interactive")) {
      closeMenu();
    }
  });

  // Fecha o menu
  function closeMenu() {
    menu.style.display = "none";
    menuIsOpen = false; // Marca que o menu foi fechado
  }

  // Impede o fechamento do menu ao clicar dentro do próprio menu
  menu.addEventListener("mousedown", (event) => {
    event.stopPropagation(); // Impede o clique de se propagar para o document
  });

  // Adiciona ações ao menu
  menu.addEventListener("click", (event) => {
    const action = event.target.dataset.action;

    if (action === "play-sound") {
      const targetSound = menu.dataset.targetSound;
      console.log(`Reproduzindo som: ${targetSound}`);
      playSound(targetSound);
    } else if (action === "view-info") {
      const targetSound = menu.dataset.targetSound;
      infoContent.textContent = `Informações detalhadas sobre o som "${targetSound}"`;
      toggleMenu(infoSubmenu);
    } else if (action === "view-animation") {
      const targetSound = menu.dataset.targetSound;
      animationContent.textContent = `Aqui seria exibida uma animação para "${targetSound}"`;
      toggleMenu(animationSubmenu);
    }
  });

  // Alterna a exibição de submenus
  function toggleMenu(submenu) {
    // Verifica se o submenu já está visível
    if (submenu.style.display === "block") {
      submenu.style.display = "none"; // Fecha o submenu
    } else {
      // Fecha os outros submenus antes de abrir o submenu atual
      infoSubmenu.style.display = "none";
      animationSubmenu.style.display = "none";
      submenu.style.display = "block"; // Abre o submenu
    }
  }

  // Função para reproduzir som (exemplo, substitua com lógica real)
  function playSound(sound) {
    if (sound) {
      console.log(`Reproduzindo som: ${sound}`);
      // Adicione lógica para reproduzir o som aqui
    } else {
      console.log("Nenhum som associado.");
    }
  }
});
