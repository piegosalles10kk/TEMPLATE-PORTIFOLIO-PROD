// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { api } from './services';
import {
    Navbar,
    HeroSection,
    AboutSection,
    SkillsSection,
    ExperienceSection,
    ProjectsSection,
    ProjectDetailsSection,
    Footer
} from './components';

// Context para compartilhar o dark mode
const DarkModeContext = React.createContext();

// Hook personalizado para usar o dark mode
export const useDarkMode = () => {
    const context = React.useContext(DarkModeContext);
    if (!context) {
        throw new Error('useDarkMode deve ser usado dentro de um DarkModeProvider');
    }
    return context;
};

// Provider do Dark Mode
const DarkModeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const storedMode = localStorage.getItem('darkMode');
        if (storedMode !== null) {
            return JSON.parse(storedMode);
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    // Aplica a classe 'dark-mode' ao body
    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-mode' : '';
    }, [isDarkMode]);

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

const MainPortfolio = () => {
    const [portfolioData, setPortfolioData] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Referências para scroll
    const sectionRefs = useRef({});

    // Usa o hook do dark mode
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [portfolioResponse, projectsResponse] = await Promise.all([
                api.getPortfolio(),
                api.getProjects()
            ]);
            setPortfolioData(portfolioResponse);
            setProjects(projectsResponse);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const sections = [
        { id: 'home', label: 'Início' },
        { id: 'about', label: 'Sobre' },
        { id: 'skills', label: 'Skills' },
        { id: 'projects', label: 'Projetos' },
        { id: 'experience', label: 'Histórico' },

    ];
    
    // Estados de carregamento/erro
    if (loading) return <div className="loading-screen">Carregando perfil profissional...</div>;
    if (error) return <div className="error-screen">Erro: Falha ao carregar dados.</div>;
    if (!portfolioData) return <div className="no-data-screen">Dados não encontrados.</div>;

    const { nome, cargo, sobreMim, tecnologias, experiencia, github, linkedin, telefone, email } = portfolioData;

    // Função para renderizar seção com referência
    const renderSection = (Component, props, id) => (
        <div ref={el => sectionRefs.current[id] = el}>
            <Component {...props} />
        </div>
    );
    
    return (
        <div className="portfolio-minimalist-wrapper">
            <Navbar 
                sections={sections} 
                sectionRefs={sectionRefs} 
                isDarkMode={isDarkMode} 
                toggleDarkMode={toggleDarkMode} 
            />

            <main className="main-content-scroll">
                {renderSection(HeroSection, { nome, cargo }, 'home')}
                <div className="content-divider"></div>
                
                {renderSection(AboutSection, { sobreMim, github, linkedin, email, telefone }, 'about')}
                <div className="content-divider"></div>
                
                {renderSection(SkillsSection, { tecnologias }, 'skills')}
                <div className="content-divider"></div>
                
                {renderSection(ProjectsSection, { projects }, 'projects')}                
                <div className="content-divider"></div>
                
                {renderSection(ExperienceSection, { experiencia }, 'experience')}
            </main>
            
            <Footer nome={nome} />
        </div>
    );
};

const Portfolio = () => {
    return (
        <DarkModeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<MainPortfolio />} />
                    <Route path="/project/:id" element={<ProjectDetailsSection />} />
                </Routes>
            </Router>
        </DarkModeProvider>
    );
};

export default Portfolio;