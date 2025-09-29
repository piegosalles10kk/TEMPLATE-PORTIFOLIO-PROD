// src/components/ProjectDetailsSection.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { api } from '../services';
import ProjectNavbar from './ProjectNavbar';

const ProjectDetailsSection = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [markdownContent, setMarkdownContent] = useState('');

    // Detecta o dark mode atual
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Verifica se o body já tem a classe dark-mode
        const bodyHasDarkMode = document.body.classList.contains('dark-mode');
        if (bodyHasDarkMode) return true;

        // Fallback para localStorage
        const storedMode = localStorage.getItem('darkMode');
        if (storedMode !== null) {
            return JSON.parse(storedMode);
        }
        
        // Fallback para preferência do sistema
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

    // Aplica dark mode ao body se necessário
    useEffect(() => {
        if (isDarkMode && !document.body.classList.contains('dark-mode')) {
            document.body.classList.add('dark-mode');
        } else if (!isDarkMode && document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    useEffect(() => {
        const loadProject = async () => {
            try {
                setLoading(true);
                setError(null);
                const projectData = await api.getProjectById(id);
                setProject(projectData);
                
                // Verifica se a descrição completa é um link do GitHub
                await loadMarkdownContent(projectData.descricaoCompletaProjeto);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [id]);

    const loadMarkdownContent = async (description) => {
        // Verifica se é um link do GitHub para arquivo markdown
        const githubRawRegex = /^https:\/\/raw\.githubusercontent\.com\/.*\.md$/;
        const githubRegex = /^https:\/\/github\.com\/.*\/blob\/.*\.md$/;
        
        if (githubRawRegex.test(description)) {
            // URL já está no formato raw
            try {
                const response = await fetch(description);
                if (response.ok) {
                    const content = await response.text();
                    setMarkdownContent(content);
                } else {
                    setMarkdownContent(description);
                }
            } catch {
                setMarkdownContent(description);
            }
        } else if (githubRegex.test(description)) {
            // Converte URL do GitHub para formato raw
            const rawUrl = description
                .replace('github.com', 'raw.githubusercontent.com')
                .replace('/blob/', '/');
            
            try {
                const response = await fetch(rawUrl);
                if (response.ok) {
                    const content = await response.text();
                    setMarkdownContent(content);
                } else {
                    setMarkdownContent(description);
                }
            } catch {
                setMarkdownContent(description);
            }
        } else {
            // É markdown direto
            setMarkdownContent(description);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getTechStack = (tecnologiasProjeto) => {
        if (!tecnologiasProjeto) return [];
        return Object.values(tecnologiasProjeto)
            .flat()
            .map(tech => tech.linguagem)
            .filter(Boolean);
    };

    if (loading) {
        return (
            <div className="project-details-loading">
                <div className="loading-spinner"></div>
                <p>Carregando detalhes do projeto...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="project-details-error">
                <h2>Erro ao carregar projeto</h2>
                <p>{error}</p>
                <button onClick={() => navigate(-1)} className="btn-back-error">
                    Voltar
                </button>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="project-details-not-found">
                <h2>Projeto não encontrado</h2>
                <button onClick={() => navigate(-1)} className="btn-back-error">
                    Voltar
                </button>
            </div>
        );
    }

    const techStack = getTechStack(project.tecnologiasProjeto);
    const hasDeploy = project.deployProjeto && project.deployProjeto.trim() !== '';

    return (
        <div className="portfolio-minimalist-wrapper">
            <ProjectNavbar />
            <div className="project-details-container">
            {/* Header com navegação */}
            <div className="project-details-header">
                <button onClick={() => navigate(-1)} className="btn-back">
                    ← Voltar aos Projetos
                </button>
                <div className="project-actions">
                    <a
                        href={project.gitHubProjeto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-github"
                    >
                        Ver no GitHub
                    </a>
                    {hasDeploy && (
                        <a
                            href={project.deployProjeto}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-deploy"
                        >
                            Ver Deploy ★
                        </a>
                    )}
                </div>
            </div>

            {/* Hero Section do Projeto */}
            <div className="project-hero">
                <div className="project-hero-content">
                    <h1 className="project-title">{project.tituloProjeto}</h1>
                    <p className="project-summary">{project.resumoProjeto}</p>
                    <div className="project-meta">
                        <span className="project-date">
                            Criado em {formatDate(project.dataCriacao)}
                        </span>
                        <div className="project-tech-tags">
                            {techStack.map((tech, index) => (
                                <span key={index} className="tech-tag-detail">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="project-image-hero">
                    <img 
                        src={project.imagemProjeto} 
                        alt={`Preview do ${project.tituloProjeto}`}
                        className="project-hero-image"
                    />
                </div>
            </div>

            {/* Conteúdo Markdown */}
            <div className="project-content">
                <div className="markdown-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={isDarkMode ? vscDarkPlus : prism}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {markdownContent}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
        </div>
    );
};

export default ProjectDetailsSection;