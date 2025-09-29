// src/components/Footer.js
import React from 'react';

const Footer = ({ nome }) => (
    <footer className="footer-minimalist">
        <p>Desenvolvido por {nome} | {new Date().getFullYear()}</p>
    </footer>
);

export default Footer;