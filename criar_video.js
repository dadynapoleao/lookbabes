// criar_video.js

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

// Inicialize o Firebase (se ainda não foi inicializado)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Obtenha uma referência ao Firestore
const db = firebase.firestore();

let filmesCache = [];
let selectedFilmeId = null;
let atoresCacheVideo = [];
let selectedActorIds = [];
let atoresCacheCena = []; // Cache for actors in Cena form
let selectedActorIdsCena = []; // Selected actor IDs for Cena form


// Função para carregar filmes e exibir na lista pesquisável (Criar Cena Form)
function carregarFilmes() {
    const filmeLista = document.getElementById('cena-filme-lista');
    const filmeSelectHidden = document.getElementById('cena-filme');
    db.collection('filmes')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get()
        .then((snapshot) => {
            filmesCache = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            filmeLista.innerHTML = '';
            filmesCache.forEach((filme) => {
                const filmeDiv = document.createElement('div');
                filmeDiv.textContent = `${filme.nome} (${filme.ano})`;
                filmeDiv.setAttribute('data-filme-id', filme.id);
                filmeDiv.setAttribute('data-filme-ano', filme.ano); // Store film year in data attribute
                filmeDiv.addEventListener('click', () => {
                    selectedFilmeId = filme.id;
                    filmeSelectHidden.value = filme.id;
                    document.getElementById('cena-filme-search').value = filmeDiv.textContent;
                    filmeLista.classList.remove('show');
                    document.querySelectorAll('#cena-filme-lista div.selected').forEach(el => el.classList.remove('selected'));
                    filmeDiv.classList.add('selected');
                    // Preencher o campo "Ano" da cena com o ano do filme selecionado
                    document.getElementById('cena-ano').value = filme.ano;
                });
                filmeLista.appendChild(filmeDiv);
            });
        });
}

// Função para filtrar filmes na lista pesquisável (Criar Cena Form)
window.filtrarFilmes = function () { // Make global
    const filtro = document.getElementById('cena-filme-search').value.toUpperCase();
    const filmeLista = document.getElementById('cena-filme-lista');
    filmeLista.classList.add('show');
    let nenhumResultado = true;

    filmeLista.querySelectorAll('div').forEach(filmeDiv => {
        const filmeNome = filmeDiv.textContent.toUpperCase();
        if (filmeNome.indexOf(filtro) > -1) {
            filmeDiv.style.display = "";
            nenhumResultado = false;
        } else {
            filmeDiv.style.display = "none";
        }
    });

    if (nenhumResultado) {
        filmeLista.innerHTML = '<div>Nenhum filme encontrado</div>';
    } else {
        if (filmeLista.querySelector('div').textContent === 'Nenhum filme encontrado') {
            filmeLista.innerHTML = '';
            filmesCache.forEach((filme) => {
                const filmeDiv = document.createElement('div');
                filmeDiv.textContent = `${filme.nome} (${filme.ano})`;
                filmeDiv.setAttribute('data-filme-id', filme.id);
                filmeDiv.setAttribute('data-filme-ano', filme.ano); // Store film year in data attribute
                filmeDiv.addEventListener('click', () => {
                    selectedFilmeId = filme.id;
                    document.getElementById('cena-filme').value = filme.id;
                    document.getElementById('cena-filme-search').value = filmeDiv.textContent;
                    filmeLista.classList.remove('show');
                    document.querySelectorAll('#cena-filme-lista div.selected').forEach(el => el.classList.remove('selected'));
                    filmeDiv.classList.add('selected');
                    // Preencher o campo "Ano" da cena com o ano do filme selecionado
                    document.getElementById('cena-ano').value = filme.ano;
                });
                filmeLista.appendChild(filmeDiv);
            });
        }
    }
};

// Função para carregar atores para o select de vídeos (Criar Video Form) - MODIFIED for Chips
function carregarAtoresParaVideo() {
    const atoresLista = document.getElementById('video-atores-lista');
    atoresLista.innerHTML = ''; // Clear list before reload
    db.collection('atores')
        .orderBy('nome')
        .get()
        .then((snapshot) => {
            atoresCacheVideo = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            atoresCacheVideo.forEach((ator) => {
                const atorDiv = document.createElement('div');
                atorDiv.textContent = ator.nome;
                atorDiv.setAttribute('data-ator-id', ator.id);

                // Check if actor is already selected and add 'selected' class if so
                if (selectedActorIds.includes(ator.id)) {
                    atorDiv.classList.add('selected');
                }

                atorDiv.addEventListener('click', () => {
                    const atorId = ator.id;
                    const atorNome = ator.nome;
                    const index = selectedActorIds.indexOf(atorId);

                    if (index === -1) {
                        selectedActorIds.push(atorId);
                        adicionarAtorChip(ator); // Call function to add chip
                        atorDiv.classList.add('selected');
                    } else {
                        selectedActorIds.splice(index, 1);
                        removerAtorChip(atorId); // Call function to remove chip
                        atorDiv.classList.remove('selected');
                    }
                    document.getElementById('video-atores').value = selectedActorIds.join(',');
                    document.getElementById('video-atores-search').value = ''; // Clear search input after selection
                    document.getElementById('video-atores-lista').classList.remove('show'); // Hide dropdown
                });
                atoresLista.appendChild(atorDiv);
            });
        });
}


// Função para filtrar atores na lista pesquisável para vídeos (Criar Video Form) - MODIFIED for Chips
window.filtrarAtoresParaVideo = function() { // Make global
    const filtro = document.getElementById('video-atores-search').value.toUpperCase();
    const atoresLista = document.getElementById('video-atores-lista');
    atoresLista.classList.add('show');
    let nenhumResultado = true;

    atoresLista.querySelectorAll('div').forEach(atorDiv => {
        const atorNome = atorDiv.textContent.toUpperCase();
        if (atorNome.indexOf(filtro) > -1) {
            atorDiv.style.display = "";
            nenhumResultado = false;
             // Check if actor is already selected and add 'selected' class if so
            if (selectedActorIds.includes(atorDiv.getAttribute('data-ator-id'))) {
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
            atoresCacheVideo.forEach((ator) => {
                const atorDiv = document.createElement('div');
                atorDiv.textContent = ator.nome;
                atorDiv.setAttribute('data-ator-id', ator.id);
                // Check if actor is already selected and add 'selected' class if so
                if (selectedActorIds.includes(ator.id)) {
                    atorDiv.classList.add('selected');
                }
                atorDiv.addEventListener('click', () => {
                    const atorId = ator.id;
                    const atorNome = ator.nome;
                    const index = selectedActorIds.indexOf(atorId);

                    if (index === -1) {
                        selectedActorIds.push(atorId);
                        adicionarAtorChip(ator); // Call function to add chip
                        atorDiv.classList.add('selected');
                    } else {
                        selectedActorIds.splice(index, 1);
                        removerAtorChip(atorId); // Call function to remove chip
                        atorDiv.classList.remove('selected');
                    }
                    document.getElementById('video-atores').value = selectedActorIds.join(',');
                    document.getElementById('video-atores-search').value = ''; // Clear search input after selection
                    document.getElementById('video-atores-lista').classList.remove('show'); // Hide dropdown
                });
                atoresLista.appendChild(atorDiv);
            });
        }
    }
};

// Função para adicionar um chip de ator abaixo do campo de pesquisa (Video Form)
function adicionarAtorChip(ator) {
    const chipsContainer = document.getElementById('selected-atores-chips');
    console.log("adicionarAtorChip - chipsContainer:", chipsContainer); // Debug log
    if (!chipsContainer) {
        console.error("chipsContainer is null in adicionarAtorChip!"); // Error log if null
        return; // Exit function if chipsContainer is null to prevent errors
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
        selectedActorIds = selectedActorIds.filter(id => id !== atorIdToRemove); // Remove from selected IDs array
        document.getElementById('video-atores').value = selectedActorIds.join(','); // Update hidden input
        removerAtorChip(atorIdToRemove); // Remove chip from display
        // OPTIONAL: Update selection in dropdown list if it's currently open (for visual consistency, but dropdown usually closes on selection)
        const atorDivInList = document.querySelector(`#video-atores-lista div[data-ator-id="${atorIdToRemove}"]`);
        if (atorDivInList) {
            atorDivInList.classList.remove('selected');
        }
    });
    chip.appendChild(removeBtn);
    chipsContainer.appendChild(chip); // Append chip to container
}

// Função para remover o chip de ator da exibição (Video Form)
function removerAtorChip(atorIdToRemove) {
    const chipsContainer = document.getElementById('selected-atores-chips');
     console.log("removerAtorChip - chipsContainer:", chipsContainer); // Debug log
     if (!chipsContainer) {
        console.error("chipsContainer is null in removerAtorChip!"); // Error log if null
        return; // Exit function if chipsContainer is null to prevent errors
    }

    const chipToRemove = chipsContainer.querySelector(`.ator-chip[data-ator-id='${atorIdToRemove}']`);
    if (chipToRemove) {
        chipsContainer.removeChild(chipToRemove);
    }
}

// Função para carregar atores para o select de cenas (Criar Cena Form)
function carregarAtoresParaCena() {
    const atoresLista = document.getElementById('cena-atores-lista');
    atoresLista.innerHTML = ''; // Clear list before reload
    db.collection('atores')
        .orderBy('nome')
        .get()
        .then((snapshot) => {
            atoresCacheCena = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            atoresCacheCena.forEach((ator) => {
                const atorDiv = document.createElement('div');
                atorDiv.textContent = ator.nome;
                atorDiv.setAttribute('data-ator-id', ator.id);

                // Check if actor is already selected and add 'selected' class if so
                if (selectedActorIdsCena.includes(ator.id)) {
                    atorDiv.classList.add('selected');
                }

                atorDiv.addEventListener('click', () => {
                    const atorId = ator.id;
                    const atorNome = ator.nome;
                    const index = selectedActorIdsCena.indexOf(atorId);

                    if (index === -1) {
                        selectedActorIdsCena.push(atorId);
                        adicionarAtorChipCena(ator); // Call function to add chip for Cena form
                        atorDiv.classList.add('selected');
                    } else {
                        selectedActorIdsCena.splice(index, 1);
                        removerAtorChipCena(atorId); // Call function to remove chip for Cena form
                        atorDiv.classList.remove('selected');
                    }
                    document.getElementById('cena-atores').value = selectedActorIdsCena.join(',');
                    document.getElementById('cena-atores-search').value = ''; // Clear search input after selection
                    document.getElementById('cena-atores-lista').classList.remove('show'); // Hide dropdown
                });
                atoresLista.appendChild(atorDiv);
            });
        });
}

// Função para filtrar atores na lista pesquisável para cenas (Criar Cena Form)
window.filtrarAtoresParaCena = function() { // Make global
    const filtro = document.getElementById('cena-atores-search').value.toUpperCase();
    const atoresLista = document.getElementById('cena-atores-lista');
    atoresLista.classList.add('show');
    let nenhumResultado = true;

    atoresLista.querySelectorAll('div').forEach(atorDiv => {
        const atorNome = atorDiv.textContent.toUpperCase();
        if (atorNome.indexOf(filtro) > -1) {
            atorDiv.style.display = "";
            nenhumResultado = false;
            // Check if actor is already selected and add 'selected' class if so
            if (selectedActorIdsCena.includes(atorDiv.getAttribute('data-ator-id'))) {
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
            atoresCacheCena.forEach((ator) => {
                const atorDiv = document.createElement('div');
                atorDiv.textContent = ator.nome;
                atorDiv.setAttribute('data-ator-id', ator.id);
                // Check if actor is already selected and add 'selected' class if so
                if (selectedActorIdsCena.includes(ator.id)) {
                    atorDiv.classList.add('selected');
                }
                atorDiv.addEventListener('click', () => {
                    const atorId = ator.id;
                    const atorNome = ator.nome;
                    const index = selectedActorIdsCena.indexOf(atorId);

                    if (index === -1) {
                        selectedActorIdsCena.push(atorId);
                        adicionarAtorChipCena(ator); // Call function to add chip for Cena form
                        atorDiv.classList.add('selected');
                    } else {
                        selectedActorIdsCena.splice(index, 1);
                        removerAtorChipCena(atorId); // Call function to remove chip for Cena form
                        atorDiv.classList.remove('selected');
                    }
                    document.getElementById('cena-atores').value = selectedActorIdsCena.join(',');
                    document.getElementById('cena-atores-search').value = ''; // Clear search input after selection
                    document.getElementById('cena-atores-lista').classList.remove('show'); // Hide dropdown
                });
                atoresLista.appendChild(atorDiv);
            });
        }
    }
};

// Função para adicionar um chip de ator abaixo do campo de pesquisa (Cena Form)
function adicionarAtorChipCena(ator) {
    const chipsContainer = document.getElementById('selected-cena-atores-chips');
    console.log("adicionarAtorChipCena - chipsContainer:", chipsContainer); // Debug log
    if (!chipsContainer) {
        console.error("chipsContainer is null in adicionarAtorChipCena!"); // Error log if null
        return; // Exit function if chipsContainer is null to prevent errors
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
        selectedActorIdsCena = selectedActorIdsCena.filter(id => id !== atorIdToRemove); // Remove from selected IDs array for Cena
        document.getElementById('cena-atores').value = selectedActorIdsCena.join(','); // Update hidden input for Cena
        removerAtorChipCena(atorIdToRemove); // Remove chip from display for Cena
        // OPTIONAL: Update selection in dropdown list if it's currently open (for visual consistency, but dropdown usually closes on selection)
        const atorDivInList = document.querySelector(`#cena-atores-lista div[data-ator-id="${atorIdToRemove}"]`);
        if (atorDivInList) {
            atorDivInList.classList.remove('selected');
        }
    });
    chip.appendChild(removeBtn);
    chipsContainer.appendChild(chip); // Append chip to container for Cena
}

// Função para remover o chip de ator da exibição (Cena Form)
function removerAtorChipCena(atorIdToRemove) {
    const chipsContainer = document.getElementById('selected-cena-atores-chips');
     console.log("removerAtorChipCena - chipsContainer:", chipsContainer); // Debug log
     if (!chipsContainer) {
        console.error("chipsContainer is null in removerAtorChipCena!"); // Error log if null
        return; // Exit function if chipsContainer is null to prevent errors
    }

    const chipToRemove = chipsContainer.querySelector(`.ator-chip[data-ator-id='${atorIdToRemove}']`);
    if (chipToRemove) {
        chipsContainer.removeChild(chipToRemove);
    }
}


// Event listener para o formulário Criar Filme
const criarFilmeForm = document.getElementById('criar-filme-form');

criarFilmeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('filme-nome').value;
    const ano = parseInt(document.getElementById('filme-ano').value, 10);
    const imagem = document.getElementById('filme-imagem').value;
    const pagina = document.getElementById('filme-pagina').value;

    const filme = {
        nome: nome,
        ano: ano,
        imagem: imagem,
        pagina: pagina,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection('filmes').add(filme)
        .then((docRef) => {
            console.log("Filme criado com ID: ", docRef.id);
            alert("Filme criado com sucesso!");
            criarFilmeForm.reset();
            carregarFilmes();
        })
        .catch((error) => {
            console.error("Erro ao criar filme: ", error);
            alert("Erro ao criar filme.");
        });
});

// Event listener para o formulário Criar Cena
const criarCenaForm = document.getElementById('criar-cena-form');

criarCenaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const filmeId = document.getElementById('cena-filme').value;
    const numeroCena = document.getElementById('cena-numero').value;
    const nome = document.getElementById('cena-nome').value;
    const ano = parseInt(document.getElementById('cena-ano').value, 10);
    const imagem = document.getElementById('cena-imagem').value;
    const pagina = document.getElementById('cena-pagina').value;
    const atores = selectedActorIdsCena; // Get actors from Cena form

    if (!filmeId) {
        alert("Por favor, selecione um filme para a cena.");
        return;
    }
    if (!numeroCena) {
        alert("Por favor, selecione o número da cena.");
        return;
    }

    const cena = {
        filmeId: filmeId,
        numeroCena: parseInt(numeroCena, 10),
        nome: nome,
        ano: ano,
        imagem: imagem,
        pagina: pagina,
        atores: atores, // Include actors in Cena object
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        const docRef = await db.collection('cenas').add(cena);
        console.log("Cena criada com ID: ", docRef.id);
        alert("Cena criada com sucesso!");

        // Update atores collection with the new cena AND film
        for (const atorId of atores) {
            const atorRef = db.collection('atores').doc(atorId);
            await atorRef.update({
                cenas: firebase.firestore.FieldValue.arrayUnion(docRef.id),
                filmesParticipados: firebase.firestore.FieldValue.arrayUnion(filmeId) // ADD THIS LINE
            });
            console.log(`Ator ${atorId} updated with cena ${docRef.id} and filme ${filmeId}`);
        }

        // Update filme collection with the new cena
        const filmeRef = db.collection('filmes').doc(filmeId);
        await filmeRef.update({
            cenas: firebase.firestore.FieldValue.arrayUnion(docRef.id)
        });
        console.log(`Filme ${filmeId} updated with cena ${docRef.id}`);


        criarCenaForm.reset();
        document.getElementById('cena-filme-search').value = '';
        document.getElementById('cena-filme').value = '';
        document.getElementById('cena-filme-lista').innerHTML = '';
        document.querySelectorAll('#cena-filme-lista div.selected').forEach(el => el.classList.remove('selected'));
        document.getElementById('cena-atores-search').value = '';
        document.getElementById('cena-atores-lista').innerHTML = '';
        selectedActorIdsCena = [];
        document.querySelectorAll('#cena-atores-lista div.selected').forEach(el => el.classList.remove('selected'));
        document.getElementById('selected-cena-atores-chips').innerHTML = ''; // Clear chips on submit for Cena form

    } catch (error) {
        console.error("Erro ao criar cena ou atualizar filme/atores: ", error);
        alert("Erro ao criar cena.");
    }
});

// Event listener para o formulário Criar Vídeo
const criarVideoForm = document.getElementById('criar-video-form');

criarVideoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('video-nome').value;
    const ano = parseInt(document.getElementById('video-ano').value, 10);
    const imagem = document.getElementById('video-imagem').value;
    const pagina = document.getElementById('video-pagina').value;
    const atores = selectedActorIds;

    if (!nome || !ano) {
        alert("Por favor, preencha o nome e o ano do vídeo.");
        return;
    }

    const video = {
        nome: nome,
        ano: ano,
        imagem: imagem,
        pagina: pagina,
        atores: atores,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        const docRef = await db.collection('videos').add(video);
        console.log("Vídeo criado com ID: ", docRef.id);
        alert("Vídeo criado com sucesso!");

        for (const atorId of atores) {
            const atorRef = db.collection('atores').doc(atorId);
            await atorRef.update({
                videos: firebase.firestore.FieldValue.arrayUnion(docRef.id)
            });
            console.log(`Ator ${atorId} atualizado com vídeo ${docRef.id}`);
        }


        criarVideoForm.reset();
        document.getElementById('video-atores-search').value = '';
        document.getElementById('video-atores-lista').innerHTML = '';
        selectedActorIds = [];
        document.querySelectorAll('#video-atores-lista div.selected').forEach(el => el.classList.remove('selected'));
        document.getElementById('selected-atores-chips').innerHTML = ''; // Clear chips on submit
    } catch (error) {
        console.error("Erro ao criar vídeo ou atualizar atores: ", error);
        alert("Erro ao criar vídeo.");
    }
});


// Carregar filmes e atores quando a página é carregada
window.onload = () => {
    carregarFilmes();
    carregarAtoresParaVideo();
    carregarAtoresParaCena(); // Load actors for Cena form as well
};

// Close dropdowns if clicked outside
window.addEventListener('click', function(event) {
    if (!event.target.closest('.searchable-select')) {
        document.querySelectorAll('.select-lista.show').forEach(list => list.classList.remove('show'));
    }
});
