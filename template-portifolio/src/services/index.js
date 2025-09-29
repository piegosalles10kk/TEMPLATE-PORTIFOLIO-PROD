// src/services/index.js
// Este arquivo serve como um "barrel export" - centraliza todas as exportações dos services
// Facilita os imports no resto da aplicação

export * from './api';

// Isso permite importar assim:
// import { api } from './services';
// 
// Ao invés de:
// import { api } from './services/api';