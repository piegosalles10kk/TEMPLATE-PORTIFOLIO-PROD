// src/components/ExperienceSection.js
import React from 'react';

const ExperienceSection = ({ experiencia }) => {
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : 'Atual';

    return (
        <section id="experience" className="section-padding experience-section">
            <h2 className="section-heading">Experiência Profissional</h2>
            <div className="timeline-container">
                {experiencia.map((exp, index) => {
                    const period = `${formatDate(exp.dataInicio)} — ${formatDate(exp.dataFim)}`;

                    return (
                        <div key={index} className="timeline-item">
                            <div className="timeline-date">{period}</div>
                            <div className="timeline-content">
                                <h3 className="job-title">{exp.cargo}</h3>
                                <p className="job-company">{exp.empresa}</p>
                                <p className="job-description">{exp.descricao}</p>
                                <div className="job-tags">
                                    {Object.values(exp.tecnologiasUsadas).flat().map((tech, i) => (
                                        <span key={i} className="tech-tag">{tech.linguagem}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ExperienceSection;