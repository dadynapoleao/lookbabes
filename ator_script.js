// ator_script.js

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

// Inicializar o Firestore
const db = firebase.firestore();

let atoresGlobais = []; // Array global para armazenar todos os atores
let atorIdGlobal; // Variável para guardar o ID do ator atual

// State to track if "Ver Mais" has been clicked for each section
let filmesVerMaisClicked = false;
let videosVerMaisClicked = false;
const initialLimit = 10; // Initial number of items to load

document.addEventListener('DOMContentLoaded', () => {
    // Obter o ID do ator da URL
    const params = new URLSearchParams(window.location.search);
    const atorId = params.get('id');
    atorIdGlobal = atorId; // Guardar o ID do ator

    if (atorId) {
        carregarDetalhesAtor(atorId);
        carregarFilmesDoAtor(atorId, initialLimit); // Carregar filmes por default
        carregarVideosDoAtor(atorId, initialLimit); // Carregar vídeos e cenas por default
    } else {
        console.error("ID do ator não encontrado na URL.");
        alert("Erro: ID do ator não encontrado.");
    }

    // Event listeners para "Ver Mais" buttons
    document.getElementById('ver-mais-filmes-btn').addEventListener('click', () => {
        filmesVerMaisClicked = true;
        carregarFilmesDoAtor(atorId, null); // Load all films when "Ver Mais" is clicked
        document.getElementById('ver-mais-filmes-btn').style.display = 'none'; // Hide "Ver Mais" button after click
    });

    document.getElementById('ver-mais-videos-btn').addEventListener('click', () => {
        videosVerMaisClicked = true;
        carregarVideosDoAtor(atorId, null); // Load all videos when "Ver Mais" is clicked
        document.getElementById('ver-mais-videos-btn').style.display = 'none'; // Hide "Ver Mais" button after click
    });
});

async function carregarDetalhesAtor(atorId) {
    let atorPrincipal; // Declare atorPrincipal here
    try {
        const docSnapshot = await db.collection("atores").doc(atorId).get();
        if (docSnapshot.exists) {
            atorPrincipal = docSnapshot.data();
            console.log("carregarDetalhesAtor - atorPrincipal fetched:", atorPrincipal); // Debug log - after fetching
            preencherPaginaAtor(atorPrincipal, atorId);
            console.log("Detalhes do ator carregados com sucesso!");
             carregarAtoresSemelhantes(atorPrincipal); // Carregar atores semelhantes APÓS carregar o ator principal
        } else {
            console.error("Ator não encontrado no Firestore.");
            alert("Ator não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao carregar detalhes do ator: ", error);
        alert("Erro ao carregar detalhes do ator do Firebase. Veja a consola para mais detalhes.");
    }
    console.log("carregarDetalhesAtor - atorPrincipal before return:", atorPrincipal); // Debug log - before function return
    return atorPrincipal; // Return atorPrincipal for debugging purposes
}

function preencherPaginaAtor(ator, atorId) {
    document.getElementById("ator-nome-completo").textContent = ator.nome || "N/A";
    document.getElementById("ator-foto-detalhe").src = ator.foto || "URL_IMAGEM_PADRAO"; // **THIS LINE IS CRUCIAL**
    document.getElementById("ator-foto-detalhe").alt = ator.nome || "Ator sem nome";
    document.getElementById("ator-idade-detalhe").textContent = ator.idade || "N/A";
    document.getElementById("ator-data-nascimento-detalhe").textContent = ator.dataNascimento || "N/A";

    // Preencher o link da nacionalidade e o texto do span da nacionalidade
    const paisSpan = document.getElementById("ator-pais-detalhe");
    const paisLink = document.getElementById("ator-pais-link");
    if (paisSpan && paisLink) {
        paisLink.href = `nacionalidades.html?pais=${ator.pais || ''}`;
        paisLink.textContent = ator.pais || "N/A";
    } else {
        console.error("Elementos 'ator-pais-detalhe' ou 'ator-pais-link' não encontrados!");
    }


    document.getElementById("ator-etnia-detalhe").textContent = ator.etnia || "N/A";
    document.getElementById("ator-cor-cabelo-detalhe").textContent = ator.corCabelo || "N/A";
    document.getElementById("ator-cor-olhos-detalhe").textContent = ator.corOlhos || "N/A";
    document.getElementById("ator-altura-detalhe").textContent = ator.altura || "N/A";
    document.getElementById("ator-peso-detalhe").textContent = ator.peso || "N/A";
    document.getElementById("ator-tipo-corpo-detalhe").textContent = ator.tipoCorpo || "N/A";
    document.getElementById("ator-medidas-detalhe").textContent = ator.medidas || "N/A";
    document.getElementById("ator-nota-detalhe").textContent = ator.nota || "N/A";

    // **Update the headings with actor's name**
    document.getElementById('filmes-heading').textContent = `Filmes de ${ator.nome}`;
    document.getElementById('videos-cenas-heading').textContent = `Vídeos e Cenas de ${ator.nome}`;
}

async function carregarFilmesDoAtor(atorId, limit = null) {
    const filmesListaContainer = document.getElementById('filmes-lista');
    filmesListaContainer.innerHTML = "<p>Carregando filmes...</p>"; // Mensagem de carregamento

    let query = db.collection('filmes').where('atores', 'array-contains', atorId);
    if (limit && !filmesVerMaisClicked) { // Apply limit only on initial load and if "Ver Mais" is not clicked
        query = query.limit(limit);
    }

    try {
        const filmesSnapshot = await query.get();

        if (!filmesSnapshot.empty) {
            const filmesDoAtor = filmesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            mostrarFilmesDoAtor(filmesListaContainer, filmesDoAtor);
            // Show "Ver Mais" button if more items are available (simple check, might need adjustment for exact counts)
            if (limit && filmesCache.length > limit && !filmesVerMaisClicked) { // Basic check to show "Ver Mais" - adjust as needed
                document.getElementById('ver-mais-filmes-btn').style.display = 'block';
            } else {
                document.getElementById('ver-mais-filmes-btn').style.display = 'none';
            }
        } else {
            filmesListaContainer.innerHTML = "<p>Este ator não participou em nenhum filme.</p>";
            document.getElementById('ver-mais-filmes-btn').style.display = 'none'; // Hide button if no filmes
        }
    } catch (error) {
        console.error("Erro ao carregar filmes do ator: ", error);
        filmesListaContainer.innerHTML = "<p>Erro ao carregar filmes.</p>";
        document.getElementById('ver-mais-filmes-btn').style.display = 'none'; // Hide button on error
    }
}

function mostrarFilmesDoAtor(container, filmes) {
    container.innerHTML = ''; // Limpa a mensagem "Carregando filmes..."

    if (filmes.length === 0) {
        container.innerHTML = "<p>Este ator não participou em nenhum filme.</p>";
        return;
    }

    filmes.forEach(filme => {
        const filmeDiv = document.createElement('div');
        filmeDiv.className = 'filme-video-card';
        filmeDiv.innerHTML = `
            <img src="${filme.imagem || 'URL_IMAGEM_PADRAO'}" alt="${filme.nome}" class="filme-video-imagem">
            <h3>${filme.nome}</h3>
            <p>Ano: ${filme.ano}</p>
            <a href="${filme.pagina || '#'}" target="_blank">Ver Mais</a>
        `;
        container.appendChild(filmeDiv);
    });
}


async function carregarVideosDoAtor(atorId, limit = null) {
    const videosListaContainer = document.getElementById('videos-lista');
    videosListaContainer.innerHTML = "<p>Carregando vídeos e cenas...</p>";

    let query = db.collection('videos').where('atores', 'array-contains', atorId);
    let queryCenas = db.collection('cenas').where('atores', 'array-contains', atorId); // Query for cenas

    if (limit && !videosVerMaisClicked) { // Apply limit only on initial load and if "Ver Mais" is not clicked
        query = query.limit(limit);
        queryCenas = queryCenas.limit(limit); // Apply limit to cenas query as well
    }


    try {
        // Carregar Vídeos
        const videosSnapshot = await query.get();

        // Carregar Cenas
        const cenasSnapshot = await queryCenas.get();


        let videosDoAtor = videosSnapshot.docs.map(doc => ({ type: 'video', id: doc.id, ...doc.data() }));
        let cenasDoAtor = cenasSnapshot.docs.map(doc => ({ type: 'cena', id: doc.id, ...doc.data() }));

        const conteudoAtor = [...videosDoAtor, ...cenasDoAtor]; // Combina vídeos e cenas

        if (conteudoAtor.length > 0) {
            mostrarVideosDoAtor(videosListaContainer, conteudoAtor);
             // Show "Ver Mais" button if more items are available (simple check, might need adjustment for exact counts)
            if (limit && conteudoAtor.length > limit && !videosVerMaisClicked) { // Basic check to show "Ver Mais" - adjust as needed
                document.getElementById('ver-mais-videos-btn').style.display = 'block';
            } else {
                document.getElementById('ver-mais-videos-btn').style.display = 'none';
            }
        } else {
            videosListaContainer.innerHTML = "<p>Este ator não participou em vídeos ou cenas.</p>";
            document.getElementById('ver-mais-videos-btn').style.display = 'none'; // Hide button if no videos
        }


    } catch (error) {
        console.error("Erro ao carregar vídeos e cenas do ator: ", error);
        videosListaContainer.innerHTML = "<p>Erro ao carregar vídeos e cenas.</p>";
        document.getElementById('ver-mais-videos-btn').style.display = 'none'; // Hide button on error
    }
}


function mostrarVideosDoAtor(container, conteudos) {
    container.innerHTML = '';
    if (conteudos.length === 0) {
        container.innerHTML = "<p>Este ator não participou em vídeos ou cenas.</p>";
        return;
    }

    conteudos.forEach(conteudo => {
        const conteudoDiv = document.createElement('div');
        conteudoDiv.className = 'filme-video-card';
        conteudoDiv.innerHTML = `
            <img src="${conteudo.imagem || 'URL_IMAGEM_PADRAO'}" alt="${conteudo.nome}" class="filme-video-imagem">
            <h3>${conteudo.nome} (${conteudo.type === 'video' ? 'Vídeo' : 'Cena'})</h3>
            <p>Ano: ${conteudo.ano}</p>
            <a href="${conteudo.pagina || '#'}" target="_blank">Ver Mais</a>
        `;
        container.appendChild(conteudoDiv);
    });
}


async function carregarAtoresSemelhantes(atorPrincipal) {
    console.log("carregarAtoresSemelhantes - atorPrincipal:", atorPrincipal); // Debug log - check atorPrincipal here!
    try {
        const snapshot = await db.collection("atores").get();
        atoresGlobais = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Carrega todos os atores para o array global

        const atoresSemelhantes = encontrarAtoresSemelhantes(atorPrincipal, atoresGlobais);
        mostrarAtoresSemelhantes(atoresSemelhantes);

    } catch (error) {
        console.error("Erro ao carregar atores semelhantes: ", error);
        alert("Erro ao carregar atores semelhantes.");
    }
}

function encontrarAtoresSemelhantes(atorPrincipal, todosAtores) {
    console.log("encontrarAtoresSemelhantes - atorPrincipal in function:", atorPrincipal); // Debug log - check atorPrincipal inside function

    // Capture atorPrincipal in a separate variable outside the filter for clarity
    const principalActor = atorPrincipal;

    return todosAtores.filter(ator => { // Using arrow function here
        // **PRIMEIRO: EXCLUIR O ATOR PRINCIPAL**
        console.log(`Comparando ator ID: ${ator.id} com atorPrincipal ID: ${principalActor?.id}`); // LOGGING! - use optional chaining
        if (ator.id === principalActor?.id) { // Use atorPrincipal directly within the arrow function
            console.log(`Excluindo ator com ID: ${ator.id} por ser o ator principal.`); // LOGGING!
            return false; // Exclui o próprio ator principal
        }

        let scoreSemelhanca = 0;

        // Critérios de semelhança com pesos (AJUSTE OS PESOS CONFORME NECESSÁRIO)
        if (ator.corCabelo === principalActor?.corCabelo) scoreSemelhanca += 20; // Use optional chaining
        if (ator.corOlhos === principalActor?.corOlhos) scoreSemelhanca += 15; // Use optional chaining
        if (ator.tipoCorpo === principalActor?.tipoCorpo) scoreSemelhanca += 25; // Use optional chaining
        if (ator.etnia === principalActor?.etnia) scoreSemelhanca += 10; // Use optional chaining

        // Critério de altura com range (Peso: 20%)
        const alturaPrincipal = parseInt(principalActor?.altura) || 0; // Use optional chaining
        const alturaAtor = parseInt(ator.altura) || 0;
        if (Math.abs(alturaAtor - alturaPrincipal) <= 5) scoreSemelhanca += 20; // Tolerância de 5cm

        // Critério de idade com range (Peso: 10%)
        const idadePrincipal = parseInt(principalActor?.idade) || 0; // Use optional chaining
        const idadeAtor = parseInt(ator.idade) || 0;
        if (Math.abs(idadeAtor - idadePrincipal) <= 5) scoreSemelhanca += 10;   // Tolerância de 5 anos


        // **ALTERAÇÃO IMPORTANTE: FILTRAR POR PERCENTAGEM DE SEMELHANÇA >= 75%**
        return scoreSemelhanca >= 75; // Considera semelhante SE A PONTUAÇÃO FOR 75% OU MAIOR
    })
    .map(ator => {
        // Calcular a percentagem de semelhança (PODE AJUSTAR O CÁLCULO CONFORME NECESSÁRIO)
        let percentagemSemelhanca = 0;
        if (ator.corCabelo === principalActor?.corCabelo) percentagemSemelhanca += 25; // Use optional chaining
        if (ator.tipoCorpo === principalActor?.tipoCorpo) percentagemSemelhanca += 25; // Use optional chaining
        if (ator.medidas === principalActor?.medidas) percentagemSemelhanca += 25; // Use optional chaining
        if (Math.abs(parseInt(ator.altura) - parseInt(principalActor?.altura)) <= 5) percentagemSemelhanca += 25; // Use optional chaining

        return { ...ator, percentagemSemelhanca: percentagemSemelhanca, id: ator.id }; // Retorna ator com percentagem e ID
    });
}


function mostrarAtoresSemelhantes(atoresSemelhantes) {
    const containerSemelhantes = document.getElementById("atores-semelhantes-lista");
    if (!containerSemelhantes) {
        console.error("Elemento 'atores-semelhantes-lista' não encontrado!");
        return;
    }
    containerSemelhantes.innerHTML = "";

    if (atoresSemelhantes.length === 0) {
        containerSemelhantes.innerHTML = "<p>Não foram encontrados atores semelhantes com 75% ou mais de semelhança.</p>";
        return;
    }

    atoresSemelhantes.forEach(atorSemelhante => {
        const cardLink = document.createElement("a");
        cardLink.href = `ator.html?id=${atorSemelhante.id}`;
        cardLink.style.textDecoration = 'none';

        const card = document.createElement("div");
        card.className = "ator-card";

        card.innerHTML = `
            <img src="${atorSemelhante.foto}" alt="${atorSemelhante.nome}" class="ator-foto">
            <h3>
                ${atorSemelhante.nome}
                <span class="percentagem-semelhanca">(${atorSemelhante.percentagemSemelhanca}% Semelhante)</span>
            </h3>
            <p>Nacionalidade: ${atorSemelhante.pais}</p>
            <p>Idade: ${atorSemelhante.idade} anos</p>
        `;
        cardLink.appendChild(card);
        containerSemelhantes.appendChild(cardLink);
    });
}


// Função mostrarAtores (COPIE A FUNÇÃO mostrarAtores DO SEU script.js COMPLETO AQUI!)
function mostrarAtores(containerId, atoresParaMostrar) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Elemento '${containerId}' não encontrado na página!`);
        return;
    }
    container.innerHTML = "";

    atoresParaMostrar.forEach((ator, index) => {
        const cardLink = document.createElement("a");
        cardLink.href = `ator.html?id=${ator.id}`;
        cardLink.style.textDecoration = 'none';

        const card = document.createElement("div");
        card.className = "ator-card";

        card.innerHTML = `
            <img src="${ator.foto}" alt="${ator.nome}" class="ator-foto">
            <h3 class="ator-nome-card">${ator.nome}</h3>
            <div class="ator-info-stack">
                <p class="ator-nacionalidade-card">${ator.pais}</p>
                <p class="ator-idade-card">${ator.idade} anos</p>
            </div>
        `;

        cardLink.appendChild(card);
        container.appendChild(cardLink);
    });
}
