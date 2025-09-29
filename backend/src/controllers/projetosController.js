const { Projetos } = require('../models/Models');

const createProjeto = async (req, res) => {
    const { tituloProjeto, resumoProjeto, backend, frontend, dB, deploy, imagemProjeto, descricaoCompletaProjeto, gitHubProjeto, deployProjeto } = req.body;

    console.log('Payload recebido:', req.body);

     const missingFields = [];
    if (!tituloProjeto) missingFields.push('tituloProjeto');
    if (!resumoProjeto) missingFields.push('resumoProjeto');
    if (!imagemProjeto) missingFields.push('imagemProjeto');
    if (!descricaoCompletaProjeto) missingFields.push('descricaoCompletaProjeto');
    if (!gitHubProjeto) missingFields.push('gitHubProjeto');

    if (missingFields.length > 0) {
      console.log('Campos obrigatórios faltando:', missingFields.join(', '));
      return res.status(422).json({ message: `Campos obrigatórios faltando: ${missingFields.join(', ')}` });
    }

    const dataHoje = new Date();

     const projeto = new Projetos({
      tituloProjeto,
      resumoProjeto,
      tecnologiasProjeto : {
        backend,
        frontend,
        dB,
        deploy
      },
      dataCriacao: dataHoje,
      imagemProjeto,
      descricaoCompletaProjeto,
      gitHubProjeto,
      deployProjeto,
    });
  
    try {
      await projeto.save();
      res.status(201).json({ msg: 'Projeto criado com sucesso' });
    } catch (error) {
      console.log('Erro ao criar usuário:', error);
      res.status(500).json({ msg: 'Erro ao criar usuário' });
    }

}

const getProjetos = async (req, res) => {
    try {
        const projetos = await Projetos.find(); 
        res.status(200).json(projetos);
    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        res.status(500).json({ msg: 'Erro ao buscar projetos', error: error.message });
    }
};

const getProjetoById = async (req, res) => {
    const { id } = req.params;

    try {
        const projeto = await Projetos.findById(id);

        if (!projeto) {
            return res.status(404).json({ msg: 'Projeto não encontrado.' });
        }

        res.status(200).json(projeto);
    } catch (error) {
        console.error(`Erro ao buscar projeto ID ${id}:`, error);
        res.status(500).json({ msg: 'Erro ao buscar projeto.' });
    }
};


const updateProjeto = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const projetoAtualizado = await Projetos.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!projetoAtualizado) {
            return res.status(404).json({ msg: 'Projeto não encontrado para atualização.' });
        }

        res.status(200).json({ msg: 'Projeto atualizado com sucesso', projeto: projetoAtualizado });
    } catch (error) {
        console.error(`Erro ao atualizar projeto ID ${id}:`, error);
        res.status(500).json({ msg: 'Erro ao atualizar projeto.', error: error.message });
    }
};

const deleteProjeto = async (req, res) => {
    const { id } = req.params;

    try {
        const projetoDeletado = await Projetos.findByIdAndDelete(id);

        if (!projetoDeletado) {
            return res.status(404).json({ msg: 'Projeto não encontrado para exclusão.' });
        }
        res.status(204).send({msg: 'Projeto deletado com sucesso'}); 
    } catch (error) {
        console.error(`Erro ao deletar projeto ID ${id}:`, error);
        res.status(500).json({ msg: 'Erro ao deletar projeto.' });
    }
};

module.exports = { createProjeto, 
                    getProjetos, 
                    getProjetoById, 
                    updateProjeto, 
                    deleteProjeto 
                };