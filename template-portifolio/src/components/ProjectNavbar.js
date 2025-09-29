// src/components/ProjectNavbar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectNavbar = () => {
    const navigate = useNavigate();
    
    // Estado do dark mode sincronizado com localStorage e body
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const bodyHasDarkMode = document.body.classList.contains('dark-mode');
        if (bodyHasDarkMode) return true;

        const storedMode = localStorage.getItem('darkMode');
        if (storedMode !== null) {
            return JSON.parse(storedMode);
        }
        
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Monitora mudanças na classe do body
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const bodyHasDarkMode = document.body.classList.contains('dark-mode');
                    setIsDarkMode(bodyHasDarkMode);
                }
            });
        });

        observer.observe(document.body, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });

        return () => observer.disconnect();
    }, []);

    // Função para alternar dark mode
    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode));
        
        if (newMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    return (
        <header className="navbar-container">
            <button 
                onClick={() => navigate('/')} 
                className="navbar-logo"
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    color: 'var(--color-primary)'
                }}
            >
                {'<Dev />'}
            </button>
            
            <nav className="navbar-menu">
                <button
                    onClick={() => navigate('/')}
                    className="nav-link"
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer' 
                    }}
                >
                    Voltar ao Portfólio
                </button>
            </nav>
            
            <button 
                onClick={toggleDarkMode} 
                className="dark-mode-toggle" 
                aria-label={isDarkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>
        </header>
    );
};

export default ProjectNavbar;