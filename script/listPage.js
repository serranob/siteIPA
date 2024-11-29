document.addEventListener("DOMContentLoaded", () => {
    const createFlashcardBtn = document.getElementById("createFlashcardBtn");
    const studyFlashcardsBtn = document.getElementById("studyFlashcardsBtn");
    const flashcardsContainer = document.getElementById("flashcardsContainer");
    const placeholder = document.getElementById("placeholder");

    const flashcardModal = document.getElementById("flashcardModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const saveFlashcardBtn = document.getElementById("saveFlashcardBtn");
    const flashcardFront = document.getElementById("flashcardFront");
    const flashcardBack = document.getElementById("flashcardBack");

    const savedLists = JSON.parse(localStorage.getItem('lists')) || [];
    const urlParams = new URLSearchParams(window.location.search);
    const listId = urlParams.get("listId");
    const listTitle = document.getElementById("listTitle");

    let list = listId ? savedLists[listId] : null;
    let editingIndex = null;

    const isStudyPage = document.body.classList.contains('study-page');

    // Função para renderizar os flashcards
    function renderFlashcards() {
        flashcardsContainer.innerHTML = ""; 
        if (list && list.flashcards.length === 0) {
            placeholder.style.display = "block";
        } else {
            placeholder.style.display = "none";
            list.flashcards.forEach((flashcard, index) => {
                const flashcardItem = document.createElement("div");
                flashcardItem.classList.add("flashcard-item");
                flashcardItem.innerHTML = `
                    <span>${flashcard.front}</span>
                    <button class="editBtn">Editar</button>
                    <button class="removeBtn">Remover</button>
                `;
                flashcardsContainer.appendChild(flashcardItem);

                // Evento de clique para editar
                const editBtn = flashcardItem.querySelector('.editBtn');
                editBtn.addEventListener('click', () => editFlashcard(index));

                // Evento de clique para remover
                const removeBtn = flashcardItem.querySelector('.removeBtn');
                removeBtn.addEventListener('click', () => removeFlashcard(index));
            });
        }
    }

    // Função para editar flashcards
    function editFlashcard(index) {
        const flashcard = list.flashcards[index];
        flashcardFront.value = flashcard.front;
        flashcardBack.value = flashcard.back;
        document.getElementById("modalTitle").textContent = "Editar Flashcard";

        editingIndex = index;
        flashcardModal.style.display = "flex";
    }

    // Função para remover flashcards
    function removeFlashcard(index) {
        // Remover flashcard da lista
        list.flashcards.splice(index, 1);

        // Atualizar o localStorage
        localStorage.setItem('lists', JSON.stringify(savedLists));

        // Re-renderizar os flashcards após remoção
        renderFlashcards();
    }

    // Função para salvar ou editar flashcard
    function saveFlashcard() {
        const front = flashcardFront.value.trim();
        const back = flashcardBack.value.trim();

        if (front && back) {
            if (editingIndex !== null) {
                list.flashcards[editingIndex].front = front;
                list.flashcards[editingIndex].back = back;
                editingIndex = null;
            } else {
                list.flashcards.push({ front, back });
            }

            // Salvando as mudanças no localStorage
            localStorage.setItem('lists', JSON.stringify(savedLists));
            renderFlashcards();
            flashcardModal.style.display = "none";
        } else {
            alert("Por favor, preencha ambos os lados do flashcard.");
        }
    }

    // Função para voltar à página anterior
    function goBack() {
        window.history.back(); // Volta para a página anterior
    }

    // Função para criar uma nova lista de flashcards
    function createNewFlashcardList(listName) {
        const newList = { name: listName, flashcards: [] };
        savedLists.push(newList);
        localStorage.setItem('lists', JSON.stringify(savedLists));

        // Redireciona para a nova lista
        window.location.href = `listPage.html?listId=${savedLists.length - 1}`;
    }

    // Renderiza a lista de flashcards
    function renderLists() {
        const createGrid = document.querySelector(".create-grid");
        createGrid.innerHTML = '';
        
        const addNewListBtn = document.createElement('div');
        addNewListBtn.classList.add('flashcard-item', 'add-list');
        addNewListBtn.innerHTML = `
            <span class="add-symbol">+</span>
            <p>Criar Nova Lista</p>
        `;
        addNewListBtn.addEventListener('click', () => {
            const listName = prompt("Digite o nome da nova lista de flashcards:");
            if (listName) {
                createNewFlashcardList(listName);
            }
        });

        createGrid.appendChild(addNewListBtn);

        savedLists.forEach((list, index) => {
            const newFlashcard = document.createElement("div");
            newFlashcard.classList.add("flashcard-item", "created-card");
            newFlashcard.innerHTML = `
                <h2>${list.name}</h2>
                <p>${list.flashcards.length} Flashcards</p>
            `;
            newFlashcard.setAttribute("data-list-id", index);
            newFlashcard.addEventListener('click', () => {
                window.location.href = `listPage.html?listId=${index}`;
            });
            createGrid.appendChild(newFlashcard);
        });
    }

    // Ação dos botões
    if (createFlashcardBtn) {
        createFlashcardBtn.addEventListener("click", () => {
            flashcardModal.style.display = "flex";
            flashcardFront.value = "";
            flashcardBack.value = "";
            document.getElementById("modalTitle").textContent = "Criar Flashcard";
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            flashcardModal.style.display = "none";
        });
    }

    if (saveFlashcardBtn) {
        saveFlashcardBtn.addEventListener("click", saveFlashcard);
    }

    if (listId) {
        if (list) {
            listTitle.textContent = list.name; // Título da lista sendo exibido
            renderFlashcards();
        }
    } else {
        renderLists();
    }

    // Botão de voltar
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.addEventListener("click", goBack);
    }

    if (studyFlashcardsBtn) {
        studyFlashcardsBtn.addEventListener('click', () => {
            if (list && list.flashcards.length > 0) {
                // Redireciona para a página de estudo com o ID da lista
                window.location.href = `estudar.html?listId=${listId}`;
            } else {
                alert('Nenhum flashcard nesta lista para estudar!');
            }
        });
    }
});
