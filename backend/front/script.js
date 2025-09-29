// ==========================================================
// Variáveis Globais para CRUD
// ==========================================================
// Arrays de tags para o formulário de PROJETOS 
const projectArrays = {
    backend: [],
    frontend: [],
    dB: [],
    deploy: []
};
const projectArrayFields = ['backend', 'frontend', 'dB', 'deploy'];

// Objeto para armazenar as tecnologias GERAIS do Portfólio (com nível)
const portifolioTechs = {
    backend: [],
    frontend: [],
    dB: [],
    deploy: []
};
const portifolioTechFields = ['backend', 'frontend', 'dB', 'deploy'];

// Array para armazenar as EXPERIÊNCIAS do Portfólio
let portifolioExperiences = [];

// Variáveis globais para Projetos 
let allProjects = []; 
let currentProjectIdToDelete = null;
const API_URL = 'http://piegosalles-backend.cloud/backend-portifolio'; 
const projectsTableBody = document.getElementById('projectsTableBody'); // Elemento global da tabela


// ==========================================================
// Lógica de Portfólio
// ==========================================================

// --- Tecnologias (com Nível) ---

// Função para renderizar o formulário de entrada das tecnologias do Portfólio
function renderPortifolioTechInputs() {
    const container = document.getElementById('tecnologiasForm');
    
    // Se os inputs já existem, não renderiza novamente.
    if (container.children.length > 0) return; 

    portifolioTechFields.forEach(field => {
        const fieldName = field.toUpperCase();
        const html = `
            <div class="form-field">
                <label for="${field}Language">${fieldName} - Linguagem:</label>
                <div class="array-input-container">
                    <input type="text" id="${field}Language" placeholder="Linguagem (Ex: Java)">
                </div>
            </div>
            <div class="form-field" style="max-width: 150px;">
                <label for="${field}Level">Nível (1-10):</label>
                <div class="array-input-container">
                    <input type="number" id="${field}Level" min="1" max="10" placeholder="7">
                    <button type="button" data-field="${field}" onclick="addPortifolioTech(this)">+</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// Função para adicionar uma tecnologia com nível ao array
function addPortifolioTech(button) {
    const field = button.getAttribute('data-field');
    const langInput = document.getElementById(`${field}Language`);
    const levelInput = document.getElementById(`${field}Level`);
    
    const linguagem = langInput.value.trim();
    const nivel = parseInt(levelInput.value.trim());

    if (!linguagem || isNaN(nivel) || nivel < 1 || nivel > 10) {
        alert('Por favor, preencha a linguagem e um nível válido (1 a 10).');
        return;
    }
    
    const exists = portifolioTechs[field].some(tech => tech.linguagem.toLowerCase() === linguagem.toLowerCase());
    if (exists) {
        alert(`A tecnologia "${linguagem}" já foi adicionada em ${field}!`);
        return;
    }

    portifolioTechs[field].push({ linguagem, nivel });
    langInput.value = '';
    levelInput.value = ''; 
    renderPortifolioTechs();
}

// Função para renderizar as tags de tecnologias do Portfólio
function renderPortifolioTechs() {
    const list = document.getElementById('tecnologiasList');
    list.innerHTML = '';
    
    portifolioTechFields.forEach(field => {
        portifolioTechs[field].forEach((item, index) => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `${field.toUpperCase()}: ${item.linguagem} (Nível ${item.nivel}) <button type="button" onclick="removePortifolioTech('${field}', ${index})">x</button>`;
            list.appendChild(tag);
        });
    });
}

// Função para remover uma tecnologia do Portfólio
function removePortifolioTech(field, index) {
    portifolioTechs[field].splice(index, 1);
    renderPortifolioTechs();
}

// --- Experiências (Array de Objetos Complexos) ---

// Função para renderizar o formulário de Experiências (um mini-formulário para cada item)
function renderExperiencias() {
    const container = document.getElementById('experienciaContainer');
    container.innerHTML = '';

    portifolioExperiences.forEach((exp, index) => {
        // Garante que o objeto de tecnologias usadas existe para evitar erros
        exp.tecnologiasUsadas = exp.tecnologiasUsadas || { backend: [], frontend: [], dB: [], deploy: [] };

        const experienceHtml = `
            <div class="experience-item" style="border: 1px solid var(--border-color); padding: 15px; margin-bottom: 20px; border-radius: 8px;">
                <h3 style="margin-top: 0;">Experiência #${index + 1} - ${exp.empresa || 'Nova Empresa'}</h3>
                
                <div class="form-group">
                    <div class="form-field">
                        <label for="exp-empresa-${index}">Empresa:</label>
                        <input type="text" id="exp-empresa-${index}" value="${exp.empresa || ''}" onchange="updateExperience(${index}, 'empresa', this.value)" required>
                    </div>
                    <div class="form-field">
                        <label for="exp-cargo-${index}">Cargo:</label>
                        <input type="text" id="exp-cargo-${index}" value="${exp.cargo || ''}" onchange="updateExperience(${index}, 'cargo', this.value)" required>
                    </div>
                </div>

                <div class="form-group">
                    <div class="form-field">
                        <label for="exp-dataInicio-${index}">Data Início:</label>
                        <input type="date" id="exp-dataInicio-${index}" value="${exp.dataInicio ? exp.dataInicio.split('T')[0] : ''}" onchange="updateExperience(${index}, 'dataInicio', this.value)" required>
                    </div>
                    <div class="form-field">
                        <label for="exp-dataFim-${index}">Data Fim (Deixe vazio se for atual):</label>
                        <input type="date" id="exp-dataFim-${index}" value="${exp.dataFim ? exp.dataFim.split('T')[0] : ''}" onchange="updateExperience(${index}, 'dataFim', this.value)">
                    </div>
                </div>

                <div class="form-field">
                    <label for="exp-descricao-${index}">Descrição/Atribuições:</label>
                    <textarea id="exp-descricao-${index}" rows="3" onchange="updateExperience(${index}, 'descricao', this.value)" required>${exp.descricao || ''}</textarea>
                </div>

                <h4 style="margin-top: 20px; border-bottom: 1px dashed var(--border-color); padding-bottom: 5px;">Tecnologias Usadas</h4>
                
                ${['backend', 'frontend', 'dB', 'deploy'].map(field => {
                    const techArray = exp.tecnologiasUsadas[field] || [];
                    return `
                    <div class="form-group" style="margin-bottom: 5px;">
                        <div class="form-field">
                            <label style="font-weight: normal;">${field.toUpperCase()}:</label>
                            <div class="array-input-container">
                                <input type="text" id="exp-${index}-${field}-input" placeholder="Linguagem (Ex: Python)">
                                <button type="button" data-exp-index="${index}" data-field="${field}" onclick="addExperienceTech(this)">+</button>
                            </div>
                            <div class="tag-list" id="exp-${index}-${field}-tags" style="margin-top: 5px; min-height: 10px;">
                                ${techArray.map((tech, techIndex) => 
                                    // Renderiza o campo 'linguagem' dentro do objeto array
                                    `<span class="tag">${tech.linguagem} <button type="button" onclick="removeExperienceTech(${index}, '${field}', ${techIndex})">x</button></span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                    `;
                }).join('')}

                <button type="button" style="background-color: #dc3545; color: white; width: auto; margin-top: 15px;" onclick="removeExperience(${index})">Remover Experiência</button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', experienceHtml);
    });
}

// Handler para adicionar uma nova experiência vazia
document.getElementById('addExperienciaBtn').addEventListener('click', () => {
    portifolioExperiences.push({
        empresa: '',
        cargo: '',
        dataInicio: '',
        dataFim: '',
        descricao: '',
        tecnologiasUsadas: { backend: [], frontend: [], dB: [], deploy: [] } // Inicializa os arrays vazios
    });
    renderExperiencias();
});

// Handler para atualizar um campo simples de experiência
function updateExperience(index, key, value) {
    if (portifolioExperiences[index]) {
        portifolioExperiences[index][key] = value;
        if (key === 'empresa') {
            // Recarrega apenas para atualizar o título do bloco sem perder o foco do input
            renderExperiencias(); 
        }
    }
}

// Handler para adicionar uma tecnologia a uma experiência específica
function addExperienceTech(button) {
    const index = parseInt(button.getAttribute('data-exp-index'));
    const field = button.getAttribute('data-field');
    const inputId = `exp-${index}-${field}-input`;
    const inputElement = document.getElementById(inputId);
    const linguagem = inputElement.value.trim();

    if (linguagem && portifolioExperiences[index]) {
        portifolioExperiences[index].tecnologiasUsadas[field] = portifolioExperiences[index].tecnologiasUsadas[field] || [];

        // Verifica se já existe a linguagem no array
        if (!portifolioExperiences[index].tecnologiasUsadas[field].some(t => t.linguagem.toLowerCase() === linguagem.toLowerCase())) {
            // Adiciona como objeto { linguagem: '...' }
            portifolioExperiences[index].tecnologiasUsadas[field].push({ linguagem });
            inputElement.value = '';
            renderExperiencias(); // Recarrega para exibir a nova tag
        } else {
            alert('Tecnologia já adicionada nesta experiência.');
        }
    }
}

// Handler para remover uma tecnologia de uma experiência específica
function removeExperienceTech(expIndex, field, techIndex) {
    if (portifolioExperiences[expIndex] && portifolioExperiences[expIndex].tecnologiasUsadas[field]) {
        portifolioExperiences[expIndex].tecnologiasUsadas[field].splice(techIndex, 1);
        renderExperiencias(); 
    }
}

// Handler para remover uma experiência
function removeExperience(index) {
    if (confirm(`Tem certeza que deseja remover a experiência com a empresa: ${portifolioExperiences[index].empresa || 'Nova Empresa'}?`)) {
        portifolioExperiences.splice(index, 1);
        renderExperiencias();
    }
}


// --- Lógica de CRUD (Portfólio) ---

// Função principal de carregamento e preenchimento
async function fetchPortifolioForEdit() {
    const url = `${API_URL}/portifolio`; 
    const form = document.getElementById('portifolioForm');
    const submitBtn = document.getElementById('submitPortifolioBtn');
    
    // 1. Resetar arrays globais antes de buscar novos dados
    portifolioExperiences = [];
    portifolioTechFields.forEach(field => portifolioTechs[field].length = 0);
    renderPortifolioTechs(); // Limpa as tags antigas
    renderExperiencias(); // Limpa as experiências antigas

    try {
        const response = await fetch(url);
        
        if (response.status === 404) {
            form.reset();
            submitBtn.textContent = 'Cadastrar Novo Portifólio';
            return;
        }

        if (!response.ok) throw new Error(`Erro ao buscar Portifólio: ${response.status}`);
        
        const dataArray = await response.json();
        const data = dataArray[0]; // Pega o primeiro objeto do array
        
        if (!data) {
             form.reset();
             submitBtn.textContent = 'Cadastrar Novo Portifólio';
             return;
        }

        // 2. Preenche campos simples
        form.nomePortifolio.value = data.nome || '';
        form.cargoPortifolio.value = data.cargo || '';
        form.sobrePortifolio.value = data.sobreMim || '';
        form.githubPortifolio.value = data.github || '';
        form.linkedinPortifolio.value = data.linkedin || '';
        // Converte o telefone para string, caso venha como Number do BD (se for Number)
        form.telefonePortifolio.value = data.telefone ? String(data.telefone) : ''; 
        form.emailPortifolio.value = data.email || '';
        
        // 3. Preenche Tecnologias (com nível)
        if (data.tecnologias) {
            portifolioTechFields.forEach(field => {
                if (data.tecnologias[field] && Array.isArray(data.tecnologias[field])) {
                    portifolioTechs[field] = data.tecnologias[field];
                }
            });
        }
        renderPortifolioTechs(); // Renderiza as tags preenchidas

        // 4. Preenche Experiências
        portifolioExperiences = data.experiencia || [];
        renderExperiencias(); // Renderiza os blocos de experiência preenchidos

        submitBtn.textContent = 'Atualizar Portifólio Existente';

    } catch (error) {
        console.error("Erro ao carregar Portifólio:", error);
        const messageDiv = document.getElementById('message');
        messageDiv.className = 'error';
        messageDiv.innerHTML = `❌ Erro ao buscar Portifólio. Verifique a API. (${error.message})`;
        messageDiv.style.display = 'block';
    }
}

document.getElementById('portifolioForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const messageDiv = document.getElementById('message');
    
    // Monta o objeto de Tecnologias
    const tecnologiasPayload = {};
    portifolioTechFields.forEach(field => {
        tecnologiasPayload[field] = portifolioTechs[field];
    });

    // Validação de Experiências 
    const validExperiences = portifolioExperiences.filter(exp => 
        exp.empresa && exp.cargo && exp.descricao && exp.dataInicio
    );
    
    if (validExperiences.length !== portifolioExperiences.length) {
        alert("Por favor, preencha todos os campos obrigatórios (Empresa, Cargo, Data Início, Descrição) de todas as experiências ou remova as incompletas.");
        return;
    }
    
    // Monta o payload completo 
    const payload = {
        nome: form.nomePortifolio.value,
        cargo: form.cargoPortifolio.value,
        sobreMim: form.sobrePortifolio.value,
        github: form.githubPortifolio.value,
        linkedin: form.linkedinPortifolio.value,
        telefone: form.telefonePortifolio.value,
        email: form.emailPortifolio.value,
        tecnologias: tecnologiasPayload,
        experiencia: validExperiences
    };

    const url = `${API_URL}/send-portifolio`; 

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) { 
            messageDiv.className = 'success';
            messageDiv.innerHTML = `✅ Sucesso! Portifólio salvo/atualizado.`;
            fetchPortifolioForEdit(); 
        } else { 
            messageDiv.className = 'error';
            messageDiv.innerHTML = `❌ Erro! Status: ${response.status}. Mensagem: ${data.msg || data.error || JSON.stringify(data)}`;
        }
        messageDiv.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        messageDiv.className = 'error';
        messageDiv.innerHTML = `❌ Erro de Conexão: Servidor Portifólio offline. ${error.message}`;
        messageDiv.style.display = 'block';
    }
});

document.getElementById('clearPortifolioBtn').addEventListener('click', function() {
    document.getElementById('portifolioForm').reset();
    document.getElementById('submitPortifolioBtn').textContent = 'Cadastrar Novo Portifólio';
    
    portifolioExperiences = [];
    portifolioTechFields.forEach(field => portifolioTechs[field].length = 0);
    renderPortifolioTechs();
    renderExperiencias();
});


// ==========================================================
// Lógica de Tags (Arrays do Formulário de Projetos)
// ==========================================================
function renderTags(field) {
    const tagList = document.getElementById(`${field}Tags`);
    tagList.innerHTML = '';
    
    projectArrays[field].forEach((item, index) => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `${item} <button type="button" onclick="removeItem('${field}', ${index})">x</button>`;
        tagList.appendChild(tag);
    });
}

function addItem(button) {
    const field = button.getAttribute('data-field');
    const inputElement = document.getElementById(`${field}Input`);
    const value = inputElement.value.trim();

    if (value && !projectArrays[field].includes(value)) {
        projectArrays[field].push(value);
        inputElement.value = ''; 
        renderTags(field);
    } else if (value) {
        alert(`A tecnologia "${value}" já foi adicionada!`);
    }
}

function removeItem(field, index) {
    projectArrays[field].splice(index, 1);
    renderTags(field);
}

function resetForm() {
    const form = document.getElementById('projetoForm');
    form.reset(); 

    projectArrayFields.forEach(field => {
        projectArrays[field].length = 0; 
        renderTags(field);
    });

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Enviar Projeto para o Backend';
    submitBtn.onclick = null; // Remove o manipulador de edição (PUT)
}

// ------------------------------------------------------------------------------------------------
// ATENÇÃO: SUBSTITUA A FUNÇÃO getTechPayload ABAIXO PELA VERSÃO DE EMERGÊNCIA SE O ERRO PERSISTIR!
// VERSÃO ORIGINAL (CHAVES OPCIONAIS - DEVERIA SER O CORRETO):
// ------------------------------------------------------------------------------------------------
/**
 * @description Monta o payload de tecnologias do projeto,
 * incluindo a chave apenas se o array correspondente tiver itens,
 * tornando a categoria opcional. (Correto para Backend Flexível)
 * @returns {Object} O objeto contendo apenas as categorias de tecnologia não vazias.
 */
// function getTechPayload() {
//     const payload = {};
//     projectArrayFields.forEach(field => {
//         // Inclui a chave apenas se o array não estiver vazio
//         if (projectArrays[field].length > 0) {
//             payload[field] = projectArrays[field];
//         }
//     });
//     return payload;
// }

// ------------------------------------------------------------------------------------------------
// VERSÃO DE EMERGÊNCIA (CHAVES SEMPRE PRESENTES)
// USE ESTA SE O BACKEND EXIGIR OS CAMPOS 'frontend' e 'deploy'
// ------------------------------------------------------------------------------------------------
/**
 * @description Monta o payload de tecnologias do projeto,
 * incluindo a chave SEMPRE, mesmo que o array esteja vazio,
 * para satisfazer a validação estrita do Backend.
 * @returns {Object} O objeto contendo todas as categorias de tecnologia.
 */
function getTechPayload() {
    const payload = {};
    projectArrayFields.forEach(field => {
        // Agora, SEMPRE inclui a chave com o array (vazio ou cheio)
        payload[field] = projectArrays[field]; 
    });
    return payload;
}
// ------------------------------------------------------------------------------------------------
// FIM DA FUNÇÃO getTechPayload ALTERADA
// ------------------------------------------------------------------------------------------------


// ==========================================================
// Lógica de Projetos (CRUD - ATUALIZADO)
// ==========================================================

// NOVO: Manipulador de submissão para CRIAÇÃO (POST)
document.getElementById('projetoForm').addEventListener('submit', async function(e) {
    const submitBtn = e.target.querySelector('button[type="submit"]');

    if (submitBtn.onclick) {
        return; 
    }
    
    // MODO CRIAÇÃO (POST)
    e.preventDefault(); 
    
    const form = e.target;
    const messageDiv = document.getElementById('message');

    // 1. Monta o Payload para CRIAÇÃO
    const payload = {
        tituloProjeto: form.tituloProjeto.value,
        resumoProjeto: form.resumoProjeto.value,
        imagemProjeto: form.imagemProjeto.value,
        descricaoCompletaProjeto: form.descricaoCompletaProjeto.value,
        gitHubProjeto: form.gitHubProjeto.value,
        // Opcional: passa null se a string estiver vazia
        deployProjeto: form.deployProjeto.value.trim() || null, 
        
        // Usa a função auxiliar para incluir SÓ os arrays não vazios (opcional)
        ...getTechPayload(),
    };
    
    const url = `${API_URL}/send-projects`; // Endpoint para criar novo projeto
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) { 
            messageDiv.className = 'success';
            messageDiv.innerHTML = `✅ Sucesso! Projeto Cadastrado: ${data.msg || 'Projeto criado com sucesso.'}`;
            
            resetForm(); // Limpa o formulário e os arrays
            fetchProjects(); // Recarrega a tabela
            
        } else { 
            messageDiv.className = 'error';
            messageDiv.innerHTML = `❌ Erro no Cadastro: ${data.message || data.msg || JSON.stringify(data)}`;
        }

    } catch (error) {
        messageDiv.className = 'error';
        messageDiv.innerHTML = `❌ Erro de Conexão: O servidor (${url}) pode estar offline ou inacessível. ${error.message}`;
    }

    messageDiv.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Funções para Edição (PUT)
async function handleUpdateSubmit(e, projectId) {
    e.preventDefault(); 
    
    const form = document.getElementById('projetoForm');
    const messageDiv = document.getElementById('message');

    const payload = {
        tituloProjeto: form.tituloProjeto.value,
        resumoProjeto: form.resumoProjeto.value,
        imagemProjeto: form.imagemProjeto.value,
        descricaoCompletaProjeto: form.descricaoCompletaProjeto.value,
        gitHubProjeto: form.gitHubProjeto.value,
        // Opcional: passa null se a string estiver vazia
        deployProjeto: form.deployProjeto.value.trim() || null, 
        
        // Usa a função auxiliar para incluir SÓ os arrays não vazios (opcional)
        ...getTechPayload(),
    };
    
    const url = `${API_URL}/project/${projectId}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) { 
            messageDiv.className = 'success';
            messageDiv.innerHTML = `✅ Sucesso! Projeto Atualizado: ${data.msg || 'Projeto atualizado com sucesso.'}`;
            
            resetForm();
            fetchProjects(); 
        } else { 
            messageDiv.className = 'error';
            messageDiv.innerHTML = `❌ Erro na Atualização: ${data.message || data.msg || JSON.stringify(data)}`;
        }

    } catch (error) {
        messageDiv.className = 'error';
        messageDiv.innerHTML = `❌ Erro de Conexão: O servidor (${url}) pode estar offline ou inacessível. ${error.message}`;
    }

    messageDiv.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function editProjeto(projectId) {
    const project = allProjects.find(p => p._id === projectId);
    if (!project) {
        alert("Projeto não encontrado para edição.");
        return;
    }

    // Limpa o formulário e os arrays globais
    resetForm(); 

    document.getElementById('tituloProjeto').value = project.tituloProjeto || '';
    document.getElementById('resumoProjeto').value = project.resumoProjeto || '';
    document.getElementById('imagemProjeto').value = project.imagemProjeto || '';
    document.getElementById('descricaoCompletaProjeto').value = project.descricaoCompletaProjeto || '';
    document.getElementById('gitHubProjeto').value = project.gitHubProjeto || '';
    document.getElementById('deployProjeto').value = project.deployProjeto || '';

    const techObj = project.tecnologiasProjeto || project; 
    projectArrayFields.forEach(field => {
        if (techObj[field] && Array.isArray(techObj[field])) {
            // Limpa e preenche o array global do projeto com os dados do projeto
            projectArrays[field].length = 0; 
            projectArrays[field].push(...techObj[field]);
        }
        renderTags(field);
    });

    const submitBtn = document.getElementById('projetoForm').querySelector('button[type="submit"]');
    submitBtn.textContent = 'Atualizar Projeto';
    // Define o manipulador de edição (PUT)
    submitBtn.onclick = (e) => handleUpdateSubmit(e, projectId);
    
    document.getElementById('message').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// Funções para Deleção (DELETE)
function openDeleteModal(projectId, projectName) {
    currentProjectIdToDelete = projectId;
    const safeName = projectName.replace(/'/g, "\\'"); 
    document.getElementById('projectNameInModal').textContent = safeName;
    document.getElementById('deleteModal').style.display = 'block';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    currentProjectIdToDelete = null;
}

async function deleteProjeto() {
    const projectId = currentProjectIdToDelete;
    const url = `${API_URL}/project/${projectId}`; 
    const messageDiv = document.getElementById('message');

    closeDeleteModal(); 

    try {
        const response = await fetch(url, { method: 'DELETE' });

        if (response.ok) {
            messageDiv.className = 'success';
            messageDiv.innerHTML = `✅ Sucesso! Projeto deletado.`;
            messageDiv.style.display = 'block';
            
            fetchProjects(); 
        } else {
            const data = await response.json();
            messageDiv.className = 'error';
            messageDiv.innerHTML = `❌ Erro ao deletar: ${data.message || 'Erro desconhecido.'}`;
            messageDiv.style.display = 'block';
        }
    } catch (error) {
        messageDiv.className = 'error';
        messageDiv.innerHTML = `❌ Erro de Conexão ao deletar: ${error.message}`;
        messageDiv.style.display = 'block';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// Funções de Listagem e Filtragem
async function fetchProjects() {
    const url = `${API_URL}/projects`;
    projectsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-color);">Carregando projetos...</td></tr>`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const data = await response.json();
        allProjects = data;
        renderProjects(allProjects); 
    } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        projectsTableBody.innerHTML = `<tr><td colspan="6" class="error" style="text-align: center;">❌ Erro ao carregar projetos: ${error.message}</td></tr>`;
    }
}

function renderProjects(projectsArray) {
    projectsTableBody.innerHTML = ''; 

    if (projectsArray.length === 0) {
        projectsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-color);">Nenhum projeto encontrado.</td></tr>`;
        return;
    }

    projectsArray.forEach(project => {
        const techObj = project.tecnologiasProjeto || project; 
        const allTechs = [
            ...(techObj.backend || []),
            ...(techObj.frontend || []),
            ...(techObj.dB || [])
        ];

        const topTechs = allTechs.slice(0, 3);
        
        const techTagsHtml = topTechs.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        let deployLinkHtml = '—';

        if (project.deployProjeto && project.deployProjeto.startsWith('http')) {
            deployLinkHtml = `<a href="${project.deployProjeto}" target="_blank" class="github-link" title="${project.deployProjeto}">Acessar Deploy</a>`;
        }

        const projectId = project._id || 'no-id';
        const projectTitle = project.tituloProjeto || 'Projeto Sem Título';

        const row = `
            <tr>
                <td class="project-image-col">
                    <img src="${project.imagemProjeto}" alt="Preview do projeto" onerror="this.onerror=null;this.src='https://via.placeholder.com/60x40?text=Sem+Img';">
                </td>
                <td>${projectTitle}</td>
                <td><a href="${project.gitHubProjeto}" target="_blank" class="github-link" title="${project.gitHubProjeto}">Ver no GitHub</a></td>
                
                <td>${deployLinkHtml}</td>

                <td>${techTagsHtml}</td>
                <td class="project-actions">
                    <button class="edit-btn" onclick="editProjeto('${projectId}')">Editar</button>
                    <button class="delete-btn" onclick="openDeleteModal('${projectId}', '${projectTitle.replace(/'/g, "\\'")}')">Deletar</button>
                </td>
            </tr>
        `;
        projectsTableBody.insertAdjacentHTML('beforeend', row);
    });
}

function filterProjects() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderProjects(allProjects); 
        return;
    }

    const filtered = allProjects.filter(project => {
        if (project.tituloProjeto.toLowerCase().includes(searchTerm) ||
            project.resumoProjeto.toLowerCase().includes(searchTerm) ||
            project.gitHubProjeto.toLowerCase().includes(searchTerm)) {
            return true;
        }

        const techObj = project.tecnologiasProjeto || project;
        const allTechs = [
            ...(techObj.backend || []),
            ...(techObj.frontend || []),
            ...(techObj.dB || []),
            ...(techObj.deploy || [])
        ];

        return allTechs.some(tech => tech.toLowerCase().includes(searchTerm));
    });

    renderProjects(filtered);
}

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        filterProjects();
    }
});

document.getElementById('confirmDeleteBtn').addEventListener('click', deleteProjeto);
document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);

window.onclick = function(event) {
    const modal = document.getElementById('deleteModal');
    if (event.target == modal) {
        closeDeleteModal();
    }
}


// ==========================================================
// Lógica de Navegação
// ==========================================================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(s => s.classList.add('hidden'));
            document.getElementById(targetId).classList.remove('hidden');

            if (targetId === 'projetos-section') {
                fetchProjects();
            } else if (targetId === 'portifolio-section') {
                fetchPortifolioForEdit(); 
            }
            
            document.getElementById('message').style.display = 'none';
        });
    });
}


// ==========================================================
// Lógica de Dark Mode
// ==========================================================
const toggleButton = document.getElementById('modeToggle');

function setDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        toggleButton.textContent = '☀️ Mudar para Modo Claro';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        toggleButton.textContent = '🌙 Mudar para Modo Escuro';
        localStorage.setItem('theme', 'light');
    }
}

function loadDarkModePreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setDarkMode(true);
    } else {
        setDarkMode(false);
    }
}

toggleButton.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    setDarkMode(!isDark);
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadDarkModePreference();
    // Inicializa a navegação, que lida com a busca inicial de dados
    setupNavigation(); 
    
    // Configurações iniciais do formulário de Projetos
    projectArrayFields.forEach(renderTags);
    renderPortifolioTechInputs(); 
    
    // Garante que a primeira aba seja carregada
    document.querySelector('.main-nav a[data-target="projetos-section"]').click(); 
});