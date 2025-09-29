// src/components/AboutSection.js
import React from 'react';
import { FaGithub, FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const AboutSection = ({ sobreMim, github, linkedin, email, telefone }) => (
    <section id="about" className="section-padding about-section">
        <h2 className="section-heading">Sobre Mim</h2>
        <div className="about-content">
            <div className="about-text">
                {sobreMim.split('\n\n').map((paragraph, index) => {
                    const content = paragraph.trim(); 
                    if (!content) return null; 
                    return (
                        <p key={index} className="about-paragraph">
                            {content}
                        </p>
                    );
                })}
            </div>
            <div className="social-links-minimal">
                <a href={`https://${github}`} target="_blank" rel="noopener noreferrer" className="social-link">
                    <FaGithub className="social-icon" /> GitHub <span className="arrow">→</span>
                </a>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                    <FaLinkedin className="social-icon" /> LinkedIn <span className="arrow">→</span>
                </a>
                <a href={`https://wa.me/${telefone}`} target="_blank" rel="noopener noreferrer" className="social-link">
                    <FaWhatsapp className="social-icon" /> WhatsApp <span className="arrow">→</span>
                </a>
                <a href={`mailto:${email}`} className="social-link">
                    <FaEnvelope className="social-icon" /> Email <span className="arrow">→</span>
                </a>
            </div>

        </div>
    </section>
);

export default AboutSection;