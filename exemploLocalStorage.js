// Salvando um dado
localStorage.setItem('selectedSymbol', 'ʟ');

// Recuperando o dado
const selectedSymbol = localStorage.getItem('selectedSymbol');
console.log(selectedSymbol); // Output: ʟ

// Removendo o dado
localStorage.removeItem('selectedSymbol');

// Limpando todo o LocalStorage
localStorage.clear();
