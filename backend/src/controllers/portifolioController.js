const mongoose = require('mongoose');
const { Portifolio } = require('../models/Models');

const createOrUpdatePortifolio = async (req, res) => {
    try {
        // Tenta encontrar o único documento de portifólio
        const existingPortifolio = await Portifolio.findOne();

        if (existingPortifolio) {
            // Se existir, faz a ATUALIZAÇÃO pelo ID
            const updatedPortifolio = await Portifolio.findByIdAndUpdate(
                existingPortifolio._id, 
                { $set: req.body }, 
                { new: true, runValidators: true } // new: true retorna o documento atualizado
            );

            return res.status(200).json({ 
                msg: 'Portifólio atualizado com sucesso!', 
                data: updatedPortifolio 
            });
        }

        // Se NÃO existir, faz a CRIAÇÃO
        const newPortifolio = new Portifolio(req.body);
        const savedPortifolio = await newPortifolio.save();
        
        return res.status(201).json({ 
            msg: 'Portifólio criado com sucesso!', 
            data: savedPortifolio 
        });

    } catch (error) {
        console.error('Erro ao criar/atualizar Portifólio:', error);
        const statusCode = error.name === 'ValidationError' ? 400 : 500;
        res.status(statusCode).json({ 
            msg: 'Erro ao salvar Portifólio', 
            error: error.message 
        });
    }
};

const getAllPortifolios = async (req, res) => {
    try {
        const portifolios = await Portifolio.find().lean(); // Usamos .lean() para obter objetos JS simples e acelerar a manipulação

        if (portifolios.length === 0) {
            return res.status(404).json({ msg: 'Nenhum Portifólio encontrado.' });
        }

        // 2. Itera sobre os portfólios e ordena o array 'experiencia'
        const portifoliosOrdenados = portifolios.map(portifolio => {
            
            // Aplica a lógica de ordenação:
            portifolio.experiencia.sort((a, b) => {
                // a. Prioridade 1: dataFim inexistente (trabalho atual)
                const aFim = a.dataFim ? a.dataFim.getTime() : Infinity;
                const bFim = b.dataFim ? b.dataFim.getTime() : Infinity;

                // Ordena do mais recente (maior número) para o mais antigo (menor número).
                // Infinity (dataFim inexistente) vem antes de qualquer data.
                return bFim - aFim; 
            });

            return portifolio;
        });

        // 3. Devolve a resposta com o array ordenado
        res.status(200).json(portifoliosOrdenados);

    } catch (error) {
        console.error('Erro ao buscar Portifólios:', error);
        res.status(500).json({ 
            msg: 'Erro ao buscar Portifólios', 
            error: error.message 
        });
    }
};


const updatePortifolio = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'ID inválido.' });
    }

    try {
        const updatedPortifolio = await Portifolio.findByIdAndUpdate(
            id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );

        if (!updatedPortifolio) {
            return res.status(404).json({ msg: 'Portifólio não encontrado para atualização.' });
        }

        res.status(200).json({ 
            msg: 'Portifólio atualizado com sucesso!', 
            data: updatedPortifolio 
        });

    } catch (error) {
        console.error(`Erro ao atualizar Portifólio ID ${id}:`, error);
        const statusCode = error.name === 'ValidationError' ? 400 : 500;
        res.status(statusCode).json({ 
            msg: 'Erro ao atualizar Portifólio.', 
            error: error.message 
        });
    }
};

const deletePortifolio = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'ID inválido.' });
    }

    try {
        const deletedPortifolio = await Portifolio.findByIdAndDelete(id);

        if (!deletedPortifolio) {
            return res.status(404).json({ msg: 'Portifólio não encontrado para deleção.' });
        }

        res.status(200).json({ msg: 'Portifólio deletado com sucesso!' });

    } catch (error) {
        console.error(`Erro ao deletar Portifólio ID ${id}:`, error);
        res.status(500).json({ 
            msg: 'Erro ao deletar Portifólio.', 
            error: error.message 
        });
    }
};

module.exports = { createOrUpdatePortifolio, 
                    getAllPortifolios,
                    updatePortifolio,
                    deletePortifolio
                };