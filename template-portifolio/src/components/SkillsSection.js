// src/components/SkillsSection.js
import React from 'react';
import SkillItem from './SkillItem';

const SkillsSection = ({ tecnologias }) => {
    const categories = [
        { name: 'Back-end', key: 'backend' },
        { name: 'Front-end (Base)', key: 'frontend' },
        { name: 'Database', key: 'dB' },
        { name: 'DevOps & Cloud', key: 'deploy' },
    ];

    return (
        <section id="skills" className="section-padding skills-section">
            <h2 className="section-heading">Stack e Habilidades</h2>
            
            <div className="skills-grid">
                {categories.map(category => (
                    <div key={category.key} className="skill-category-card">
                        <h3 className="category-title">{category.name}</h3>
                        <ul className="skill-visual-list">
                            {tecnologias[category.key] && tecnologias[category.key].map((skill, index) => (
                                <SkillItem 
                                    key={index}
                                    linguagem={skill.linguagem}
                                />
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SkillsSection;