// filmes_script.js

// **Importante: Substitua com suas configurações reais!**
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // **REPLACE WITH YOUR ACTUAL API KEY FROM FIREBASE!**
    authDomain: "babes-392fd.firebaseapp.com",
    projectId: "babes-392fd",
    storageBucket: "babes-392fd.appspot.com",
    messagingSenderId: "376795361631",
    appId: "1:376795361631:web:d662f2b2f2cd23b115c6ea",
    measurementId: "SEU_MEASUREMENT_ID" // OPCIONAL: Preencha se usar Google Analytics no Firebase
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let filmesCache = [];
let todosAtoresCache = []; // Cache for all actors for actor filter
let selectedActorIdsFilmes = []; // Selected actor IDs for Filmes filter
let atoresCacheFilmes = []; // Cache for actors in Filmes filter search

document.addEventListener('DOMContentLoaded', () => {
    carregarFilmes();
    carregarAnosFilmes(); // Load years for year filter
    carregarAtoresParaFiltroFilmes(); // Load actors for actor filter
});

async function carregarFilmes() {
    const filmesListaContainer = document.getElementById('filmes-lista');
    filmesListaContainer.innerHTML = "<p>Carregando filmes...</p>";

    try {
        const snapshot = await db.collection('filmes')
            .orderBy('timestamp', 'desc')
            .get();
        filmesCache = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        carregarAnosFilmes(); // Load years after films are cached
        filtrarMostrarFilmes(); // Initial load and display (with filters if any)
    } catch (error) {
        console.error("Erro ao carregar filmes: ", error);
        filmesListaContainer.innerHTML = "<p>Erro ao carregar filmes.</p>";
    }
}

function mostrarFilmes(filmes) {
    const filmesListaContainer = document.getElementById('filmes-lista');
    filmesListaContainer.innerHTML = ''; // Clear loading message or previous content

    if (filmes.length === 0) {
        filmesListaContainer.innerHTML = "<p>Nenhum filme encontrado com os filtros selecionados.</p>";
        return;
    }

    filmes.forEach(filme => {
        const filmeDiv = document.createElement('div');
        filmeDiv.className = 'filme-video-card'; // You might want to reuse or create a new style for film cards
        filmeDiv.innerHTML = `
            <img src="${filme.imagem || 'URL_IMAGEM_PADRAO'}" alt="${filme.nome}" class="filme-video-imagem">
            <h3>${filme.nome}</h3>
            <p>Ano: ${filme.ano}</p>
            <a href="${filme.pagina || '#'}" target="_blank">Ver Mais</a>
        `;
        filmesListaContainer.appendChild(filmeDiv);
    });
}

async function carregarAnosFilmes() {
    const anosSelect = document.getElementById('ano-filtro');
    const anosSet = new Set();
    filmesCache.forEach(filme => {
        if (filme.ano) { // Check if filme.ano exists to avoid errors
            anosSet.add(filme.ano);
        }
    });
    const anos = [...anosSet]; // Get unique years from cached films
    anos.sort((a, b) => b - a); // Sort years in descending order

    anosSelect.innerHTML = '<option value="">Todos os Anos</option>'; // Clear existing options but keep "Todos os Anos"
    anos.forEach(ano => {
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        anosSelect.appendChild(option);
    });

    anosSelect.addEventListener('change', filtrarMostrarFilmes); // Attach filter function to year select change
}


// Function to filter and show films based on filters
function filtrarMostrarFilmes() {
    const anoSelecionado = document.getElementById('ano-filtro').value;
    const atoresSelecionados = selectedActorIdsFilmes;

    let filmesFiltrados = filmesCache;

    if (anoSelecionado) {
        filmesFiltrados = filmesFiltrados.filter(filme => filme.ano === parseInt(anoSelecionado));
    }

    if (atoresSelecionados && atoresSelecionados.length > 0) {
        filmesFiltrados = filmesFiltrados.filter(filme => {
            if (filme.atores && filme.atores.length > 0) {
                return filme.atores.some(atorId => atoresSelecionados.includes(atorId));
            }
            return false;
        });
    }

    mostrarFilmes(filmesFiltrados);
}

// Function to load actors for the filter (reusing logic from criar_video.js - adapt as needed)
async function carregarAtoresParaFiltroFilmes() {
    const atoresLista = document.getElementById('ator-filtro-lista');
    atoresLista.innerHTML = ''; // Clear list before reload
    try {
        const snapshot = await db.collection('atores')
            .orderBy('nome')
            .get();
        atoresCacheFilmes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        atoresCacheFilmes.forEach((ator) => {
            const atorDiv = document.createElement('div');
            atorDiv.textContent = ator.nome;
            atorDiv.setAttribute('data-ator-id', ator.id);

            // Check if actor is already selected and add 'selected' class if so
            if (selectedActorIdsFilmes.includes(ator.id)) {
                atorDiv.classList.add('selected');
            }

            atorDiv.addEventListener('click', () => {
                const atorId = ator.id;
                const atorNome = ator.nome;
                const index = selectedActorIdsFilmes.indexOf(atorId);

                if (index === -1) {
                    selectedActorIdsFilmes.push(atorId);
                    adicionarAtorChipFilmes(ator); // Call function to add chip
                    atorDiv.classList.add('selected');
                } else {
                    selectedActorIdsFilmes.splice(index, 1);
                    removerAtorChipFilmes(atorId); // Call function to remove chip
                    atorDiv.classList.remove('selected');
                }
                document.getElementById('ator-filtro').value = selectedActorIdsFilmes.join(',');
                document.getElementById('ator-filtro-search').value = ''; // Clear search input after selection
                document.getElementById('ator-filtro-lista').classList.remove('show'); // Hide dropdown
                filtrarMostrarFilmes(); // Re-filter and show films after actor selection
            });
            atoresLista.appendChild(atorDiv);
        });
    } catch (error) {
        console.error("Erro ao carregar atores para filtro de filmes: ", error);
        // Handle error appropriately - maybe display a message in the UI
    }
}


// Function to filter actors in the searchable list for Filmes filter (reusing from criar_video.js - adapt)
window.filtrarAtoresParaFilmes = window.filtrarAtoresParaFilmes  || function() { // Make global and avoid redeclaration
    const filtro = document.getElementById('ator-filtro-search').value.toUpperCase();
    const atoresLista = document.getElementById('ator-filtro-lista');
    atoresLista.classList.add('show');
    let nenhumResultado = true;

    atoresLista.querySelectorAll('div').forEach(atorDiv => {
        const atorNome = atorDiv.textContent.toUpperCase();
        if (atorNome.indexOf(filtro) > -1) {
            atorDiv.style.display = "";
            nenhumResultado = false;
             // Check if actor is already selected and add 'selected' class if so
            if (selectedActorIdsFilmes.includes(atorDiv.getAttribute('data-ator-id'))) {
                atorDiv.classList.add('selected');
            }
        } else {
            atorDiv.style.display = "none";
        }
    });

    if (nenhumResultado) {
        atoresLista.innerHTML = '<div>Nenhum ator encontrado</div>';
    } else {
        if (atoresLista.querySelector('div').textContent === 'Nenhum ator encontrado') {
            atoresLista.innerHTML = '';
            atoresCacheFilmes.forEach((ator) => {
                const atorDiv = document.createElement('div');
                atorDiv.textContent = ator.nome;
                atorDiv.setAttribute('data-ator-id', ator.id);
                // Check if actor is already selected and add 'selected' class if so
                if (selectedActorIdsFilmes.includes(ator.id)) {
                    atorDiv.classList.add('selected');
                }
                atorDiv.addEventListener('click', () => {
                    const atorId = ator.id;
                    const atorNome = ator.nome;
                    const index = selectedActorIdsFilmes.indexOf(atorId);

                    if (index === -1) {
                        selectedActorIdsFilmes.push(atorId);
                        adicionarAtorChipFilmes(ator); // Call function to add chip
                        atorDiv.classList.add('selected');
                    } else {
                        selectedActorIdsFilmes.splice(index, 1);
                        removerAtorChipFilmes(atorId); // Call function to remove chip
                        atorDiv.classList.remove('selected');
                    }
                    document.getElementById('ator-filtro').value = selectedActorIdsFilmes.join(',');
                    document.getElementById('ator-filtro-search').value = ''; // Clear search input after selection
                    document.getElementById('ator-filtro-lista').classList.remove('show'); // Hide dropdown
                    filtrarMostrarFilmes(); // Re-filter and show films after actor selection
                });
                atoresLista.appendChild(atorDiv);
            });
        }
    }
};

// Function to add actor chip for Filmes filter (reusing from criar_video.js - adapt)
function adicionarAtorChipFilmes(ator) {
    const chipsContainer = document.getElementById('selected-filmes-atores-chips');
    if (!chipsContainer) {
       console.error("chipsContainer is null in adicionarAtorChipFilmes!");
       return;
    }

    const chip = document.createElement('div');
    chip.classList.add('ator-chip');
    chip.textContent = ator.nome;
    chip.dataset.atorId = ator.id; // Store atorId in dataset

    const removeBtn = document.createElement('span');
    removeBtn.classList.add('remove-chip-btn');
    removeBtn.innerHTML = ' × '; // 'x' symbol - you can use an icon instead
    removeBtn.addEventListener('click', () => {
        const atorIdToRemove = ator.id;
        selectedActorIdsFilmes = selectedActorIdsFilmes.filter(id => id !== atorIdToRemove); // Remove from selected IDs array
        document.getElementById('ator-filtro').value = selectedActorIdsFilmes.join(','); // Update hidden input
        removerAtorChipFilmes(atorIdToRemove); // Remove chip from display
        // OPTIONAL: Update selection in dropdown list if it's currently open (for visual consistency, but dropdown usually closes on selection)
        const atorDivInList = document.querySelector(`#ator-filtro-lista div[data-ator-id="${atorIdToRemove}"]`);
        if (atorDivInList) {
            atorDivInList.classList.remove('selected');
        }
        filtrarMostrarFilmes(); // Re-filter and show films after chip removal
    });
    chip.appendChild(removeBtn);
    chipsContainer.appendChild(chip); // Append chip to container
}

// Function to remove actor chip for Filmes filter (reusing from criar_video.js - adapt)
function removerAtorChipFilmes(atorIdToRemove) {
    const chipsContainer = document.getElementById('selected-filmes-atores-chips');
    if (!chipsContainer) {
       console.error("chipsContainer is null in removerAtorChipFilmes!");
       return;
    }
    const chipToRemove = chipsContainer.querySelector(`.ator-chip[data-ator-id='${atorIdToRemove}']`);
    if (chipToRemove) {
        chipsContainer.removeChild(chipToRemove);
    }
}


// Close dropdowns if clicked outside (reusing from criar_video.js - adapt)
window.addEventListener('click', function(event) {
    if (!event.target.closest('.searchable-select')) {
        document.querySelectorAll('.select-lista.show').forEach(list => list.classList.remove('show'));
    }
});
