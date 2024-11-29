document.addEventListener("DOMContentLoaded", () => {
    // Recuperar parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const listId = urlParams.get("listId");

    // Elementos de navegação e exibição
    const flashcardsContainer = document.getElementById("flashcardsContainer");
    const placeholder = document.getElementById("placeholder");
    const studyFlashcardsContainer = document.getElementById("studyFlashcardsContainer");
    const studyListTitle = document.getElementById("studyListTitle");
    const backButton = document.getElementById("backButton"); // Botão de voltar

    // Carregar listas salvas
    const savedLists = JSON.parse(localStorage.getItem('lists')) || [];
    const list = listId ? savedLists[listId] : null;

    // Checar se a lista existe
    if (!list || list.flashcards.length === 0) {
        alert('Nenhum flashcard encontrado nesta lista. Crie alguns flashcards primeiro!');
        window.location.href = 'index.html'; // Redirecionar para a página inicial
        return;
    }

    // Elementos do flashcard para a página de estudo
    const cardFront = document.getElementById('cardFront');
    const cardBack = document.getElementById('cardBack');
    const flashcardInner = document.querySelector('.flashcard-inner');
    const prevCardBtn = document.getElementById('prevCard');
    const nextCardBtn = document.getElementById('nextCard');

    // Navegação entre os cartões de estudo
    let currentIndex = 0;

   // Função para carregar um flashcard
function loadCard(index) {
    // Esconde temporariamente o conteúdo para evitar "vazamento" visual
    cardFront.style.opacity = 0;
    cardBack.style.opacity = 0;

    // Reseta o cartão para a posição inicial antes de alterar o conteúdo
    flashcardInner.style.transition = "transform 0.3s"; // Adicione uma transição suave
    flashcardInner.style.transform = "rotateY(0)";

    // Aguarda o fim da animação antes de carregar o novo conteúdo
    setTimeout(() => {
        const { front, back } = list.flashcards[index];
        cardFront.textContent = front;
        cardBack.textContent = back;

        // Mostra o conteúdo novamente após a atualização
        cardFront.style.opacity = 1;
        cardBack.style.opacity = 1;
    }, 300); // 300ms para coincidir com a transição
}



    // Função para virar o flashcard
    flashcardInner.addEventListener('click', () => {
        const isFlipped = flashcardInner.style.transform === 'rotateY(180deg)';
        flashcardInner.style.transform = isFlipped ? 'rotateY(0)' : 'rotateY(180deg)';
    });

    // Navegação entre cartões (anterior e próximo)
    prevCardBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + list.flashcards.length) % list.flashcards.length;
        loadCard(currentIndex);
    });

    nextCardBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % list.flashcards.length;
        loadCard(currentIndex);
    });

    // Inicializa o primeiro cartão ao carregar a página
    loadCard(currentIndex);

    // Função para renderizar os flashcards na página de estudo
    function renderStudyFlashcards() {
        studyFlashcardsContainer.innerHTML = ""; // Limpar o container antes de renderizar
        if (list.flashcards.length === 0) {
            placeholder.style.display = "block"; // Exibe o placeholder caso não haja flashcards
        } else {
            placeholder.style.display = "none"; // Oculta o placeholder
            list.flashcards.forEach((flashcard) => {
                const flashcardItem = document.createElement("div");
                flashcardItem.classList.add("flashcard-item");
                flashcardItem.innerHTML = `
                    <div class="flashcard">
                        <span class="flashcard-front">${flashcard.front}</span>
                        <span class="flashcard-back">${flashcard.back}</span>
                    </div>
                    <button class="flipBtn">Virar</button>
                `;
                studyFlashcardsContainer.appendChild(flashcardItem);

                // Evento para virar o flashcard
                const flipBtn = flashcardItem.querySelector('.flipBtn');
                flipBtn.addEventListener('click', () => {
                    const front = flashcardItem.querySelector('.flashcard-front');
                    const back = flashcardItem.querySelector('.flashcard-back');
                    front.style.display = front.style.display === "none" ? "inline" : "none";
                    back.style.display = back.style.display === "none" ? "inline" : "none";
                });
            });
        }
    }

    // Exibe o nome da lista de flashcards na página de estudo
    if (list) {
        studyListTitle.textContent = `${list.name}`; // Apenas o nome da lista aqui
        renderStudyFlashcards();
    } else {
        studyListTitle.textContent = "Nenhuma lista encontrada para estudar!";
    }

    // Botão de voltar à página anterior (menu de listas ou página inicial)
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back(); // Volta para a página anterior
        });
    }
});
