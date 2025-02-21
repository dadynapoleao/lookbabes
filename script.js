// script.js (Código Completo e Corrigido com DEBUG para extrairInformacoes())

// **IMPORTANTE: SUBSTITUA "YOUR_API_KEY" PELA SUA CHAVE DE API REAL DO FIREBASE!**
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // **SUBSTITUA POR SUA API KEY REAL DO FIREBASE!**
    authDomain: "babes-392fd.firebaseapp.com",
    projectId: "babes-392fd",
    storageBucket: "babes-392fd.appspot.com",
    messagingSenderId: "376795361631",
    appId: "1:376795361631:web:d662f2b2f2cd23b115c6ea"
};

// Inicializar o Firebase
try {
    firebase.initializeApp(firebaseConfig);
} catch (error) {
    console.error("Erro ao inicializar o Firebase:", error);
    alert("Erro ao inicializar o Firebase. Verifique o console para mais detalhes.");
}

const db = firebase.firestore();

// Função para verificar se o nome do ator já existe no Firestore
async function verificarNomeAtor(nomeAtor) {
    const atoresRef = db.collection("atores");
    const snapshot = await atoresRef.where("nome", "==", nomeAtor).get();
    return !snapshot.empty; // Retorna true se o nome já existe, false se não
}

// Função para adicionar um novo ator (MODIFICADA PARA VERIFICAÇÃO DE NOME)
async function adicionarAtor() {
    console.log("adicionarAtor() chamada"); // Debug
    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;
    const dataNascimento = document.getElementById("data-nascimento").value;
    const pais = document.getElementById("pais").value;
    const etnia = document.getElementById("etnia").value;
    const corCabelo = document.getElementById("cor-cabelo").value;
    const corOlhos = document.getElementById("cor-olhos").value;
    const altura = document.getElementById("altura").value;
    const peso = document.getElementById("peso").value;
    const tipoCorpo = document.getElementById("tipo-corpo").value;
    const medidas = document.getElementById("medidas").value;
    const nota = document.getElementById("nota").value;
    const foto = document.getElementById("foto-input").value;

    if (!nome || !idade || !dataNascimento || !pais || !etnia || !corCabelo || !corOlhos || !altura || !peso || !tipoCorpo || !medidas || !nota || !foto) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Verificar se o nome já existe ANTES de adicionar
    const nomeExiste = await verificarNomeAtor(nome);
    if (nomeExiste) {
        document.getElementById("nome-feedback").textContent = "Este nome já existe. Por favor, use um nome diferente.";
        document.getElementById("nome-feedback").style.color = "red";
        return; // Não continua com a adição se o nome já existe
    } else {
        document.getElementById("nome-feedback").textContent = "Nome disponível."; // Mensagem de nome disponível
        document.getElementById("nome-feedback").style.color = "green";
    }


    const novoAtor = {
        nome,
        idade,
        dataNascimento,
        pais,
        etnia,
        corCabelo,
        corOlhos,
        altura,
        peso,
        tipoCorpo,
        medidas,
        nota,
        foto,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Salvar no Firestore
    try {
        const docRef = await db.collection("atores").add(novoAtor);
        console.log("Ator adicionado ao Firestore com sucesso, ID:", docRef.id);
        alert("Ator adicionado com sucesso e salvo no Firebase!");
    } catch (error) {
        console.error("Erro ao adicionar ator ao Firestore: ", error);
        alert("Erro ao salvar ator no Firebase. Veja a consola para mais detalhes.");
        return;
    }

    // Redirecionar para index.html após adicionar o ator
    window.location.href = 'index.html';

    // Limpar o formulário após adicionar
    document.getElementById("info-texto").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("data-nascimento").value = "";
    document.getElementById("pais").value = "";
    document.getElementById("etnia").value = "";
    document.getElementById("cor-cabelo").value = "";
    document.getElementById("cor-olhos").value = "";
    document.getElementById("altura").value = "";
    document.getElementById("peso").value = "";
    document.getElementById("tipo-corpo").value = "";
    document.getElementById("medidas").value = "";
    document.getElementById("nota").value = "0";
    document.getElementById("foto-input").value = "";
}


// Função para extrair as informações do texto e preencher os campos automaticamente
function extrairInformacoes() {
    console.log("extrairInformacoes() chamada"); // Para debug
    const texto = document.getElementById("info-texto").value;
    console.log("Texto de entrada:", texto); // DEBUG: Mostrar o texto de entrada

    // Expressões regulares atualizadas para encontrar as informações
    const idadeMatch = texto.match(/Age:\s*(\d+)/);
    console.log("idadeMatch:", idadeMatch); // DEBUG: Mostrar o resultado do regex para idade
    const nascimentoMatch = texto.match(/Born:\s*(?:[A-Za-z]+\s+)?(\d{1,2})(?:th|st|nd|rd)?\s+of\s+([A-Za-z]+)\s+(\d{4})/i);
    console.log("nascimentoMatch:", nascimentoMatch); // DEBUG: Mostrar o resultado do regex para nascimento
    const birthplaceMatch = texto.match(/Birthplace:\s*(.*)/); // Captura toda a linha "Birthplace"
    console.log("birthplaceMatch:", birthplaceMatch); // DEBUG: Mostrar o resultado do regex para birthplace
    const etniaMatch = texto.match(/Ethnicity:\s*([\w\s]+)(?=[,\n:])/); // Etnia (até vírgula, quebra de linha ou dois pontos)
    console.log("etniaMatch:", etniaMatch); // DEBUG: Mostrar o resultado do regex para etnia
    const cabeloMatch = texto.match(/Hair color:\s*([\w\s]+)(?=[,\n:])/); // Cor do cabelo (até vírgula, quebra de linha ou dois pontos)
    console.log("cabeloMatch:", cabeloMatch); // DEBUG: Mostrar o resultado do regex para cabelo
    const olhosMatch = texto.match(/Eye color:\s*([\w\s]+)(?=[,\n:])/); // Cor dos olhos (até vírgula, quebra de linha ou dois pontos)
    console.log("olhosMatch:", olhosMatch); // DEBUG: Mostrar o resultado do regex para olhos
    const alturaMatch = texto.match(/Height:\s*(?:[\d'"]+.*?\d{1,2}\s?cm|[\d]+(?:\.\d+)?\s?cm)/); // Altura (apenas números em cm)
    console.log("alturaMatch:", alturaMatch); // DEBUG: Mostrar o resultado do regex para altura
    const pesoMatch = texto.match(/Weight:\s*(?:[\d]+(?:\.\d+)?\s?lbs \(or\s([\d]+)\s?kg\)|[\d]+(?:\.\d+)?\s?kg)/); // Peso (apenas números em kg)
    console.log("pesoMatch:", pesoMatch); // DEBUG: Mostrar o resultado do regex para peso
    const tipoCorpoMatch = texto.match(/Body type:\s*([\w\s]+)(?=[,\n:])/); // Tipo de corpo (até vírgula, quebra de linha ou dois pontos)
    console.log("tipoCorpoMatch:", tipoCorpoMatch); // DEBUG: Mostrar o resultado do regex para tipoCorpo
    const medidasMatch = texto.match(/Measurements:\s*([\dA-Za-z\-]+)/); // Medidas
    console.log("medidasMatch:", medidasMatch); // DEBUG: Mostrar o resultado do regex para medidas

    // Função para extrair o país da linha "Birthplace"
    function extrairPais(birthplace) {
        if (!birthplace) return "N/A"; // Se não houver linha "Birthplace", retorna "N/A"
        const partes = birthplace.split(","); // Divide a string pelos separadores (vírgulas)
        const pais = partes[partes.length - 1].trim(); // Pega o último elemento e remove espaços extras
        return pais || "N/A"; // Retorna "N/A" se estiver vazio
    }

    // Funções para limpar e extrair informações (já definidas anteriormente - mantenha-as)
    function limparEtnia(etnia) {
        if (!etnia) return "N/A";
        return etnia.trim().replace(/[,;:\n].*/, "") || "N/A";
    }

    function limparCorCabelo(corCabelo) {
        if (!corCabelo) return "N/A";
        return corCabelo.trim().replace(/[,;:\n].*/, "") || "N/A";
    }

    function limparCorOlhos(corOlhos) {
        if (!corOlhos) return "N/A";
        return corOlhos.trim().replace(/[,;:\n].*/, "") || "N/A";
    }

    function limparAltura(altura) {
        if (!altura) return "N/A";
        const match = altura.match(/(\d+)\s?cm/);
        return match ? match[1] : "N/A";
    }

    function limparPeso(peso) {
        if (!peso) return "N/A";
        const match = peso.match(/(\d+)\s?kg/);
        return match ? match[1] : "N/A";
    }

    function limparTipoCorpo(tipoCorpo) {
        if (!tipoCorpo) return "N/A";
        return tipoCorpo.trim().replace(/[,;:\n].*/, "") || "N/A";
    }

    function limparMedidas(medidas) {
        if (!medidas) return "N/A";
        return medidas.trim() || "N/A";
    }


    // Preenchendo os campos com as informações extraídas
    document.getElementById("nome").value = "N/A"; // Inicializa com "N/A"
    document.getElementById("idade").value = "N/A";
    document.getElementById("data-nascimento").value = ""; // Defina para string vazia "" em vez de "N/A" - CORREÇÃO AQUI!
    document.getElementById("pais").value = "N/A";
    document.getElementById("etnia").value = "N/A";
    document.getElementById("cor-cabelo").value = "N/A";
    document.getElementById("cor-olhos").value = "N/A";
    document.getElementById("altura").value = "N/A";
    document.getElementById("peso").value = "N/A";
    document.getElementById("tipo-corpo").value = "N/A";
    document.getElementById("medidas").value = "N/A";

    if (idadeMatch) {
        document.getElementById("idade").value = idadeMatch[1];
        console.log("Idade definida:", idadeMatch[1]); // DEBUG: Mostrar o valor definido para idade
    } else {
        console.log("Idade não encontrada no texto."); // DEBUG: Mensagem se não encontrar idade
    }
    if (nascimentoMatch) {
        // Extrai dia, mês e ano do regex
        const dia = nascimentoMatch[1];
        const mesNome = nascimentoMatch[2];
        const ano = nascimentoMatch[3];

        // Converte o nome do mês para número (ex: "January" para 1)
        const mesNumero = new Date(Date.parse(mesNome + " 1, 2000")).getMonth() + 1; // Usando um ano qualquer para o parse
        const mesFormatado = mesNumero < 10 ? '0' + mesNumero : mesNumero; // Adiciona '0' se for menor que 10
        const diaFormatado = dia < 10 ? '0' + dia : dia; // Adiciona '0' se for menor que 10


        // Formata a data para YYYY-MM-DD (formato do input type="date")
        const dataFormatada = `${ano}-${mesFormatado}-${diaFormatado}`;
        document.getElementById("data-nascimento").value = dataFormatada;
        console.log("Data de Nascimento definida:", dataFormatada); // DEBUG: Mostrar a data de nascimento definida
    } else {
        console.log("Data de Nascimento não encontrada no texto."); // DEBUG: Mensagem se não encontrar data de nascimento
    }
    if (birthplaceMatch) {
        const pais = extrairPais(birthplaceMatch[1]); // Extrai o país da linha "Birthplace"
        document.getElementById("pais").value = pais;
        console.log("País definido:", pais); // DEBUG: Mostrar o país definido
    } else {
        console.log("País não encontrado no texto."); // DEBUG: Mensagem se não encontrar país
    }
    if (etniaMatch) {
        const etnia = limparEtnia(etniaMatch[1]); // Limpa e extrai a etnia corretamente
        document.getElementById("etnia").value = etnia;
        console.log("Etnia definida:", etnia); // DEBUG: Mostrar a etnia definida
    } else {
        console.log("Etnia não encontrada no texto."); // DEBUG: Mensagem se não encontrar etnia
    }
    if (cabeloMatch) {
        const corCabelo = limparCorCabelo(cabeloMatch[1]); // Limpa e extrai a cor do cabelo corretamente
        document.getElementById("cor-cabelo").value = corCabelo;
        console.log("Cor do Cabelo definida:", corCabelo); // DEBUG: Mostrar a cor do cabelo definida
    } else {
        console.log("Cor do Cabelo não encontrada no texto."); // DEBUG: Mensagem se não encontrar cor do cabelo
    }
    if (olhosMatch) {
        const corOlhos = limparCorOlhos(olhosMatch[1]); // Limpa e extrai a cor dos olhos corretamente
        document.getElementById("cor-olhos").value = corOlhos;
        console.log("Cor dos Olhos definida:", corOlhos); // DEBUG: Mostrar a cor dos olhos definida
    } else {
        console.log("Cor dos Olhos não encontrada no texto."); // DEBUG: Mensagem se não encontrar cor dos olhos
    }
    if (alturaMatch) {
        const alturaCm = limparAltura(alturaMatch[0]); // Limpa e extrai apenas o valor em centímetros
        document.getElementById("altura").value = alturaCm;
        console.log("Altura definida:", alturaCm); // DEBUG: Mostrar a altura definida
    } else {
        console.log("Altura não encontrada no texto."); // DEBUG: Mensagem se não encontrar altura
    }
    if (pesoMatch) {
        const pesoKg = limparPeso(pesoMatch[0]); // Limpa e extrai apenas o valor em quilogramas
        document.getElementById("peso").value = pesoKg;
        console.log("Peso definido:", pesoKg); // DEBUG: Mostrar o peso definido
    } else {
        console.log("Peso não encontrado no texto."); // DEBUG: Mensagem se não encontrar peso
    }
    if (tipoCorpoMatch) {
        const tipoCorpo = limparTipoCorpo(tipoCorpoMatch[1]); // Limpa e extrai apenas o tipo de corpo
        document.getElementById("tipo-corpo").value = tipoCorpo;
        console.log("Tipo de Corpo definido:", tipoCorpo); // DEBUG: Mostrar o tipo de corpo definido
    } else {
        console.log("Tipo de Corpo não encontrado no texto."); // DEBUG: Mensagem se não encontrar tipo de corpo
    }
    if (medidasMatch) {
        const medidas = limparMedidas(medidasMatch[1]); // Limpa e extrai as medidas
        document.getElementById("medidas").value = medidas;
        console.log("Medidas definidas:", medidas); // DEBUG: Mostrar as medidas definidas
    } else {
        console.log("Medidas não encontradas no texto."); // DEBUG: Mensagem se não encontrar medidas
    }
}


// Função para pré-visualizar a imagem (MANTER - FUNCIONALIDADE INALTERADA)
function previewImage() {
    const fotoInput = document.getElementById("foto-input");
    const imagePreview = document.getElementById("image-preview");
    const imagePreviewContainer = document.getElementById("image-preview-container");

    if (fotoInput.value) {
        // Define o src da imagem como o valor do input
        imagePreview.src = fotoInput.value;
        imagePreview.style.display = "block"; // Mostra a imagem
    } else {
        // Oculta a imagem se o campo estiver vazio
        imagePreview.style.display = "none";
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const extrairInfoButton = document.getElementById('extrair-info-btn');
    if (extrairInfoButton) {
        extrairInfoButton.addEventListener('click', extrairInformacoes);
    } else {
        console.error("Botão 'Extrair Informações' não encontrado!");
    }

    const fotoInput = document.getElementById('foto-input');
    if (fotoInput) {
        fotoInput.addEventListener('input', previewImage); // Attach previewImage to input event
    } else {
        console.error("Input 'foto' não encontrado!");
    }

    const adicionarAtorButton = document.getElementById('adicionar-ator-btn');
    if (adicionarAtorButton) {
        adicionarAtorButton.addEventListener('click', adicionarAtor); // Attach adicionarAtor to click event
    } else {
        console.error("Botão 'Adicionar Ator' não encontrado!");
    }

    // Event listener para verificar o nome enquanto digita
    const nomeInput = document.getElementById('nome');
    if (nomeInput) {
        nomeInput.addEventListener('input', async () => { // Use 'input' event para verificação em tempo real
            const nomeDigitado = nomeInput.value;
            if (nomeDigitado.trim() === "") { // Se o campo nome estiver vazio, limpa o feedback
                document.getElementById("nome-feedback").textContent = "";
                return; // Não faz a verificação se o nome está vazio
            }
            const nomeExiste = await verificarNomeAtor(nomeDigitado);
            const feedbackDiv = document.getElementById("nome-feedback");
            if (nomeExiste) {
                feedbackDiv.textContent = "Este nome já existe. Por favor, use um nome diferente.";
                feedbackDiv.style.color = "red";
            } else {
                feedbackDiv.textContent = "Nome disponível.";
                feedbackDiv.style.color = "green";
            }
        });
    } else {
        console.error("Input 'nome' não encontrado!");
    }
});
