// src/components/SkillItem.js
import React from 'react';

const SkillItem = ({ linguagem }) => {
    // Tenta extrair a chave do ícone (ex: 'Node.js(Express)' -> 'nodejs')
    const iconKeyMatch = linguagem.match(/^([^(\s]+)/);
    let iconKey = iconKeyMatch ? iconKeyMatch[1].toLowerCase().trim() : linguagem.toLowerCase().trim();
    iconKey = iconKey.replace(/\./g, '').replace(/ /g, '');

    // Mapeamento manual para casos comuns onde o regex falha ou a skillicons usa outra chave
    const iconMap = {
        'nodejs': 'nodejs',
        'java': 'java',
        'python': 'python',
        'react': 'react',
        'php': 'php',
        'sql': 'mysql', 
        'nosql': 'mongodb', 
        'express': 'express',
        'spring': 'spring',
        'flask': 'flask',
        'aws': 'aws',
        'azure': 'azure',
        'vps': 'linux', 
        'hyperv': 'windows', 
        'docker': 'docker',
    };
    const finalIconKey = iconMap[iconKey] || iconKey;

    return (
        <li className="skill-visual-item-simple">
            <img 
                src={`https://skillicons.dev/icons?i=${finalIconKey}`} 
                alt={`${linguagem} Icon`}
                className="skill-icon"
                onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = "https://skillicons.dev/icons?i=default"; 
                }}
            />
            <span className="skill-name-text">{linguagem}</span>
        </li>
    );
};

export default SkillItem;