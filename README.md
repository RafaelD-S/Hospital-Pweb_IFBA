# Hospital PWeb (Frontend)

Aplicação web para gestão de um sistema hospitalar (pacientes, médicos, consultas e administração). Este repositório contém o frontend em React + Vite.

Backend: https://github.com/luad3cristal/medSystemAPI

## Stack

- React + Vite
- React Router
- SCSS
- Fetch API

## Funcionalidades

- Autenticação (login e registro de paciente/médico)
- Listagem e edição de médicos e pacientes
- Agendamento, conclusão e cancelamento de consultas
- Perfil do usuário (paciente/médico) com edição
- Aprovação de usuários pendentes (admin)

## Configuração

Crie um arquivo .env na raiz com a URL do backend:

VITE_API_URL=http://localhost:8080

## Instalação

1. Instale as dependências:
   - npm install

2. Rode o projeto em desenvolvimento:
   - npm run dev

3. Build de produção:
   - npm run build

## Scripts úteis

- npm run dev: inicia o servidor de desenvolvimento
- npm run build: gera a build de produção
- npm run preview: serve a build localmente

## Estrutura de pastas (resumo)

- src/components: componentes reutilizáveis (botões, inputs, modais, etc.)
- src/pages: páginas principais do app
- src/services: comunicação com API
- src/utils: utilitários (validadores, mapeamentos, etc.)
- src/styles: estilos globais e variáveis

## Observações

- Para funcionar corretamente, o backend precisa estar rodando e a variável VITE_API_URL apontando para ele.
- As rotas e permissões variam conforme o papel do usuário (ADMIN, DOCTOR, PATIENT).
