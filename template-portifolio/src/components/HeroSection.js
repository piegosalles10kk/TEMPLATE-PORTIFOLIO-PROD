// src/components/HeroSection.js
import React from 'react';

const HeroSection = ({ nome, cargo }) => (
    <section id="home" className="section-full-height hero-section">
        <h1 className="hero-name">{nome}</h1>
        <h2 className="hero-title">{cargo}</h2>
        <div className="hero-cta">
            <a href="#projects" className="cta-button primary">Ver Projetos</a>
        </div>
    </section>
);

export default HeroSection;