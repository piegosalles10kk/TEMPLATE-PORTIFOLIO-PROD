// src/components/ProjectsSection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectsSection = ({ projects }) => {
    const navigate = useNavigate();

    const handleProjectClick = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    return (
        <section id="projects" className="section-padding projects-section">
            <h2 className="section-heading">Principais Projetos</h2>
            <div className="projects-grid-minimal">
                {projects.length === 0 ? (
                    <p className="no-projects">Nenhum projeto encontrado. Repositórios em breve.</p>
                ) : (
                    projects.map((projeto) => {
                        const techs = Object.values(projeto.tecnologiasProjeto).flat().map(t => t.linguagem).join(', ');
                        
                        // Verifica se o campo deployProjeto existe e não está vazio
                        const hasDeploy = projeto.deployProjeto && projeto.deployProjeto.trim() !== '';

                        return (
                            <div key={projeto._id} className="project-card">
                                {/* Imagem do Projeto - Clicável */}
                                <div 
                                    className="project-image-wrapper project-clickable" 
                                    onClick={() => handleProjectClick(projeto._id)}
                                    title="Clique para ver detalhes"
                                >
                                    <img 
                                        src={projeto.imagemProjeto} 
                                        alt={`Preview do Projeto ${projeto.tituloProjeto}`} 
                                        className="project-image"
                                    />
                                </div>

                                <h3 
                                    className="project-card-title project-clickable" 
                                    onClick={() => handleProjectClick(projeto._id)}
                                    title="Clique para ver detalhes"
                                >
                                    {projeto.tituloProjeto}
                                </h3>
                                <p className="project-card-summary">{projeto.resumoProjeto}</p>
                                
                                <div className="project-card-details">
                                    <p className="project-card-tech">Stack: {techs || "N/A"}</p>
                                    
                                    <div className="project-links-group">
                                        
                                        <a
                                            href={projeto.gitHubProjeto}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="project-link-button-minimal"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Código →
                                        </a>
                                        
                                        {hasDeploy && (
                                            <a
                                                href={projeto.deployProjeto}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="project-link-button-deploy"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Deploy ★
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default ProjectsSection;