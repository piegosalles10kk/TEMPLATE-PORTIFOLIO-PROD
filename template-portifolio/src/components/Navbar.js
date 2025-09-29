// src/components/Navbar.js
import React from 'react';

const Navbar = ({ sections, sectionRefs, isDarkMode, toggleDarkMode }) => {
    const scrollToSection = (id) => {
        if (sectionRefs.current[id]) {
            sectionRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <header className="navbar-container">
            <div className="navbar-logo">{'<Dev />'}</div>
            <nav className="navbar-menu">
                {sections.map(item => (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="nav-link"
                    >
                        {item.label}
                    </button>
                ))}
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

export default Navbar;