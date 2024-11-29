document.addEventListener("DOMContentLoaded", () => {
    // Selecionando elementos do DOM
    const addNewListBtn = document.getElementById("addNewListBtn"); // Botão "Criar Nova Lista"
    const createListModal = document.getElementById("createListModal"); // Modal para criação
    const closeModal = document.getElementById("closeModal"); // Botão de fechar modal
    const saveList = document.getElementById("saveList"); // Botão "Salvar Lista"
    const createGrid = document.querySelector(".create-grid"); // Grade onde as novas listas serão adicionadas
    const listNameInput = document.getElementById("listName"); // Campo de texto para o nome da lista

    // Função para atualizar a exibição das listas
    function renderLists() {
        // Recupera as listas armazenadas (por enquanto, usando localStorage)
        const savedLists = JSON.parse(localStorage.getItem('lists')) || [];
        
        // Limpa a grade antes de adicionar as listas
        createGrid.innerHTML = '';

        // Adiciona o botão de "Criar Nova Lista"
        createGrid.innerHTML = `
            <div class="flashcard-item add-list" id="addNewListBtn">
                <span class="add-symbol">+</span>
                <p>Criar Nova Lista</p>
            </div>
        `;

        // Renderiza as listas existentes
        savedLists.forEach((list, index) => {
            const newFlashcard = document.createElement("div");
            newFlashcard.classList.add("flashcard-item", "created-card");
            newFlashcard.innerHTML = `
                <h2>${list.name}</h2>
                <p>${list.flashcards.length} Flashcards</p>
            `;
            newFlashcard.setAttribute("data-list-id", index);  // Adiciona um id único à lista

            // Adiciona a lista à grade
            createGrid.appendChild(newFlashcard);
        });

        // Reanexa o evento de clique para abrir o modal de edição ou visualização
        const createdCards = document.querySelectorAll(".created-card");
        createdCards.forEach(card => {
            card.addEventListener("click", () => {
                const listId = card.getAttribute("data-list-id"); // Obtém o ID da lista
                window.location.href = `listPage.html?listId=${listId}`; // Redireciona para a nova página
            });
        });

        // Reanexa o evento de clique para abrir o modal de criação de novas listas
        const addNewListBtn = document.getElementById("addNewListBtn");
        addNewListBtn.addEventListener("click", () => {
            createListModal.style.display = "flex";
        });
    }

    // Renderiza as listas ao carregar a página
    renderLists();

    // Fecha o modal ao clicar no botão "Fechar"
    closeModal.addEventListener("click", () => {
        createListModal.style.display = "none";
        listNameInput.value = ""; // Limpa o campo de texto
    });

    // Fecha o modal ao clicar fora dele
    window.addEventListener("click", (event) => {
        if (event.target === createListModal) {
            createListModal.style.display = "none";
            listNameInput.value = "";
        }
    });

    // Ação para adicionar nova lista ao salvar
    saveList.addEventListener("click", () => {
        const listName = listNameInput.value.trim(); // Obtém o nome da lista
        if (listName) {
            // Recupera as listas existentes do localStorage
            const savedLists = JSON.parse(localStorage.getItem('lists')) || [];
            
            // Cria a nova lista e a adiciona à lista existente
            savedLists.push({ name: listName, flashcards: [] });

            // Armazena novamente as listas no localStorage
            localStorage.setItem('lists', JSON.stringify(savedLists));

            // Fecha o modal e limpa o campo de texto
            createListModal.style.display = "none";
            listNameInput.value = "";

            // Re-renderiza a lista de listas
            renderLists();
        } else {
            alert("Por favor, insira um nome para a lista.");
        }
    });
});
