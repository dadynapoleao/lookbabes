// script.js

// Configuração do Firebase (COLE A SUA CONFIGURAÇÃO AQUI)
const firebaseConfig = {
    apiKey: "AIzaSyBZEffPMXgbSHYUUrNdIS5duAVGlKlmSq0",
    authDomain: "babes-392fd.firebaseapp.com",
    projectId: "babes-392fd",
    storageBucket: "babes-392fd.appspot.com",
    messagingSenderId: "376795361631",
    appId: "1:376795361631:web:d662f2b2f2cd23b115c6ea",
    measurementId: "SEU_MEASUREMENT_ID" // OPCIONAL: Preencha se usar Google Analytics no Firebase
};

console.log("Firebase:", typeof firebase);

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar o Firestore
const db = firebase.firestore();

// ... (rest of your functions: mostrarAtores, adicionarAtor, extrairInformacoes, carregarUltimosAtores, previewImage) ...


// Função para pesquisar atores no Firestore com base no termo de pesquisa
async function pesquisarAtores(searchTerm) {
    console.log("pesquisarAtores chamada com termo:", searchTerm); // DEBUG
    const searchResultsContainer = document.getElementById("searchResults");
    if (!searchResultsContainer) {
        console.error("Elemento 'searchResults' não encontrado!");
        return;
    }
    searchResultsContainer.innerHTML = "<p>A pesquisar atores...</p>"; // Mensagem de carregamento inicial

    if (!searchTerm) {
        searchResultsContainer.innerHTML = ""; // Limpa os resultados se a pesquisa estiver vazia
        return;
    }

    try {
        const snapshot = await db.collection("atores")
            .orderBy('nome') // Ordenar por nome para melhor experiência de pesquisa
            .get();

        let atoresFiltrados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(ator => {
                // Safely check if ator.nome exists and is a string before toLowerCase()
                const actorName = ator.nome; // Get ator.nome once
                if (typeof actorName === 'string' && actorName) { // Check if it's a non-empty string
                    return actorName.toLowerCase().includes(searchTerm.toLowerCase());
                } else {
                    return false; // If ator.nome is not a valid string, don't include in results
                }
            });


        console.log("pesquisarAtores - atoresFiltrados:", atoresFiltrados); // DEBUG

        mostrarAtores("searchResults", atoresFiltrados); // Exibe os atores filtrados no container de resultados
        if (atoresFiltrados.length === 0) {
            searchResultsContainer.innerHTML = "<p>Nenhum ator encontrado com este nome.</p>";
        }
    } catch (error) {
        console.error("Erro ao pesquisar atores no Firestore: ", error);
        searchResultsContainer.innerHTML = "<p>Erro ao pesquisar atores.</p>";
    }
}


// ... (rest of your functions: carregarAtores, the DOMContentLoaded event listener) ...


document.addEventListener('DOMContentLoaded', () => {
    const extrairInfoButton = document.getElementById('extrair-info-btn');
    if (extrairInfoButton) {
        extrairInfoButton.addEventListener('click', extrairInformacoes);
    } else {
        console.error("Botão 'Extrair Informações' não encontrado!");
    }

    const fotoInput = document.getElementById('foto-input');
    if (fotoInput) {
        fotoInput.addEventListener('input', previewImage);
    } else {
        console.error("Input 'foto' não encontrado!");
    }

    const adicionarAtorButton = document.getElementById('adicionar-ator-btn');
    if (adicionarAtorButton) {
        adicionarAtorButton.addEventListener('click', adicionarAtor);
    } else {
        console.error("Botão 'Adicionar Ator' não encontrado!");
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value;
            pesquisarAtores(searchTerm); // Chama a função de pesquisa a cada input
        });
    } else {
        console.error("Input de pesquisa 'searchInput' não encontrado!");
    }
});
