// **IMPORTANTE: SUBSTITUA TODOS OS "PLACEHOLDERS" ABAIXO COM AS SUAS CONFIGURAÇÕES REAIS DO FIREBASE!**
// **VOCÊ PRECISA OBTER ESSAS INFORMAÇÕES NO CONSOLE DO SEU PROJETO FIREBASE.**
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // **REPLACE WITH YOUR ACTUAL API KEY FROM FIREBASE!**
    authDomain: "babes-392fd.firebaseapp.com",
    projectId: "babes-392fd",
    storageBucket: "babes-392fd.appspot.com",
    messagingSenderId: "376795361631",
    appId: "1:376795361631:web:d662f2b2f2cd23b115c6ea",
    measurementId: "SEU_MEASUREMENT_ID" // OPCIONAL: Preencha se usar Google 
};

// Inicializar o Firebase
try {
    firebase.initializeApp(firebaseConfig);
} catch (error) {
    console.error("Erro ao inicializar o Firebase:", error);
    alert("Erro ao inicializar o Firebase. Verifique o console para mais detalhes."); // Alerta mais amigável
}

const db = firebase.firestore();

let videosCenasCache = []; // Cache for both videos and cenas
let filmesCacheVideos = []; // Cache for films for film filter
let atoresCacheVideos = []; // Cache for actors for actor filter
let selectedActorIdsVideos = []; // Selected actor IDs for Videos filter
let selectedFilmeIdVideos = null; // Selected film ID for Videos filter

document.addEventListener('DOMContentLoaded', () => {
    carregarVideosCenas();
    carregarAnosVideosCenas(); // Load years for year filter
    carregarAtoresParaFiltroVideos(); // Load actors for actor filter
    carregarFilmesParaFiltroVideos(); // Load films for film filter
});

async function carregarVideosCenas() {
    const videosListaContainer = document.getElementById('videos-lista');
    videosListaContainer.innerHTML = "<p>Carregando vídeos e cenas...</p>";

    try {
        const videosSnapshot = await db.collection('videos').orderBy('timestamp', 'desc').get();
        const cenasSnapshot = await db.collection('cenas').orderBy('timestamp', 'desc').get();

        const videos = videosSnapshot.docs.map(doc => ({ type: 'video', id: doc.id, ...doc.data() }));
        const cenas = cenasSnapshot.docs.map(doc => ({ type: 'cena', id: doc.id, ...doc.data() }));

        videosCenasCache = [...videos, ...cenas]; // Combine videos and cenas in cache
        carregarAnosVideosCenas(); // Load years after data is cached
        filtrarMostrarVideosCenas(); // Initial load and display
    } catch (error) {
        console.error("Erro ao carregar vídeos e cenas: ", error);
        videosListaContainer.innerHTML = "<p>Erro ao carregar vídeos e cenas. Consulte o console para mais detalhes.</p>"; // Mensagem de erro mais útil
    }
}

function mostrarVideosCenas(conteudos) {
    const videosListaContainer = document.getElementById('videos-lista');
    videosListaContainer.innerHTML = '';

    if (conteudos.length === 0) {
        videosListaContainer.innerHTML = "<p>Nenhum vídeo ou cena encontrado com os filtros selecionados.</p>";
        return;
    }

    conteudos.forEach(conteudo => {
        const conteudoDiv = document.createElement('div');
        conteudoDiv.className = 'filme-video-card'; // Reusing style from filmes
        conteudoDiv.innerHTML = `
            <img src="${conteudo.imagem || 'URL_IMAGEM_PADRAO'}" alt="${conteudo.nome}" class="filme-video-imagem">
            <h3>${conteudo.nome} (${conteudo.type === 'video' ? 'Vídeo' : 'Cena'})</h3>
            <p>Ano: ${conteudo.ano}</p>
            <a href="${conteudo.pagina || '#'}" target="_blank">Ver Mais</a>
        `;
        videosListaContainer.appendChild(conteudoDiv);
    });
}

async function carregarAnosVideosCenas() {
    const anosSelect = document.getElementById('ano-filtro');
    const anosSet = new Set();
    videosCenasCache.forEach(conteudo => {
        if (conteudo.ano) {
            anosSet.add(conteudo.ano);
        }
    });
    const anos = [...anosSet];
    anos.sort((a, b) => b - a);

    anosSelect.innerHTML = '<option value="">Todos os Anos</option>';
    anos.forEach(ano => {
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        anosSelect.appendChild(option);
    });

    anosSelect.addEventListener('change', filtrarMostrarVideosCenas);
}

function filtrarMostrarVideosCenas() {
    const anoSelecionado = document.getElementById('ano-filtro').value;
    const atoresSelecionados = selectedActorIdsVideos;
    const filmeSelecionadoId = selectedFilmeIdVideos;

    let conteudosFiltrados = videosCenasCache;

    if (anoSelecionado) {
        conteudosFiltrados = conteudosFiltrados.filter(conteudo => conteudo.ano === parseInt(anoSelecionado));
    }

    if (atoresSelecionados && atoresSelecionados.length > 0) {
        conteudosFiltrados = conteudosFiltrados.filter(conteudo => {
            if (conteudo.atores && conteudo.atores.length > 0) {
                return conteudo.atores.some(atorId => atoresSelecionados.includes(atorId));
            }
            return false;
        });
    }

    if (filmeSelecionadoId) {
        conteudosFiltrados = conteudosFiltrados.filter(conteudo => conteudo.type === 'cena' && conteudo.filmeId === filmeSelecionadoId);
    }

    mostrarVideosCenas(conteudosFiltrados);
}

// Load actors for filter (reusing and adapting from filmes_script.js)
async function carregarAtoresParaFiltroVideos() {
    const atoresLista = document.getElementById('ator-filtro-lista');
    atoresLista.innerHTML = '';
    try {
        const snapshot = await db.collection('atores').orderBy('nome').get();
        atoresCacheVideos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        atoresCacheVideos.forEach(ator => {
            const atorDiv = document.createElement('div');
            atorDiv.textContent = ator.nome;
            atorDiv.setAttribute('data-ator-id', ator.id);
            if (selectedActorIdsVideos.includes(ator.id)) {
                atorDiv.classList.add('selected');
            }
            atorDiv.addEventListener('click', () => {
                const atorId = ator.id;
                const index = selectedActorIdsVideos.indexOf(atorId);
                if (index === -1) {
                    selectedActorIdsVideos.push(atorId);
                    adicionarAtorChipVideos(ator);
                    atorDiv.classList.add('selected');
                } else {
                    selectedActorIdsVideos.splice(index, 1);
                    removerAtorChipVideos(atorId);
                    atorDiv.classList.remove('selected');
                }
                document.getElementById('ator-filtro').value = selectedActorIdsVideos.join(',');
                document.getElementById('ator-filtro-search').value = '';
                document.getElementById('ator-filtro-lista').classList.remove('show');
                filtrarMostrarVideosCenas();
            });
            atoresLista.appendChild(atorDiv);
        });
    } catch (error) {
        console.error("Erro ao carregar atores para filtro de vídeos: ", error);
    }
}

window.filtrarAtoresParaVideos = window.filtrarAtoresParaVideos || function() {
    const filtro = document.getElementById('ator-filtro-search').value.toUpperCase();
    const atoresLista = document.getElementById('ator-filtro-lista');
    atoresLista.classList.add('show');
    let nenhumResultado = false;
    atoresLista.querySelectorAll('div').forEach(atorDiv => {
        const atorNome = atorDiv.textContent.toUpperCase();
        if (atorNome.indexOf(filtro) > -1) {
            atorDiv.style.display = "";
            nenhumResultado = true;
        } else {
            atorDiv.style.display = "none";
        }
    });
    if (!nenhumResultado) atoresLista.innerHTML = '<div>Nenhum ator encontrado</div>';
};

function adicionarAtorChipVideos(ator) {
    const chipsContainer = document.getElementById('selected-videos-atores-chips');
    const chip = document.createElement('div');
    chip.classList.add('ator-chip');
    chip.textContent = ator.nome;
    chip.dataset.atorId = ator.id;
    const removeBtn = document.createElement('span');
    removeBtn.classList.add('remove-chip-btn');
    removeBtn.innerHTML = ' × ';
    removeBtn.addEventListener('click', () => {
        const atorIdToRemove = ator.id;
        selectedActorIdsVideos = selectedActorIdsVideos.filter(id => id !== atorIdToRemove);
        document.getElementById('ator-filtro').value = selectedActorIdsVideos.join(',');
        removerAtorChipVideos(atorIdToRemove);
        filtrarMostrarVideosCenas();
    });
    chip.appendChild(removeBtn);
    chipsContainer.appendChild(chip);
}

function removerAtorChipVideos(atorIdToRemove) {
    const chipsContainer = document.getElementById('selected-videos-atores-chips');
    const chipToRemove = chipsContainer.querySelector(`.ator-chip[data-ator-id='${atorIdToRemove}']`);
    if (chipToRemove) chipsContainer.removeChild(chipToRemove);
}


// Load films for filter
async function carregarFilmesParaFiltroVideos() {
    const filmesLista = document.getElementById('filme-filtro-lista');
    filmesLista.innerHTML = '';
    try {
        const snapshot = await db.collection('filmes').orderBy('nome').get();
        filmesCacheVideos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        filmesCacheVideos.forEach(filme => {
            const filmeDiv = document.createElement('div');
            filmeDiv.textContent = filme.nome;
            filmeDiv.setAttribute('data-filme-id', filme.id);
            filmeDiv.addEventListener('click', () => {
                selectedFilmeIdVideos = filme.id;
                document.getElementById('filme-filtro').value = filme.id;
                document.getElementById('filme-filtro-search').value = filme.nome;
                filmesLista.classList.remove('show'); // Corrigido: Usar filmesLista em vez de filmeLista
                filtrarMostrarVideosCenas(); // Re-filter on film selection
            });
            filmesLista.appendChild(filmeDiv);
        });
    } catch (error) {
        console.error("Erro ao carregar filmes para filtro de vídeos: ", error);
    }
}

window.filtrarFilmesParaVideos = window.filtrarFilmesParaVideos || function() {
    const filtro = document.getElementById('filme-filtro-search').value.toUpperCase();
    const filmesLista = document.getElementById('filme-filtro-lista');
    filmesLista.classList.add('show');
    let nenhumResultado = false;
    filmesLista.querySelectorAll('div').forEach(filmeDiv => {
        const filmeNome = filmeDiv.textContent.toUpperCase();
        if (filmeNome.indexOf(filtro) > -1) {
            filmeDiv.style.display = "";
            nenhumResultado = true;
        } else {
            filmeDiv.style.display = "none";
        }
    });
     if (!nenhumResultado) filmesLista.innerHTML = '<div>Nenhum filme encontrado</div>';
};


// Close dropdowns if clicked outside (reusing from criar_video.js - adapt)
window.addEventListener('click', function(event) {
    if (!event.target.closest('.searchable-select')) {
        document.querySelectorAll('.select-lista.show').forEach(list => list.classList.remove('show'));
    }
});
