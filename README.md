# Hospital PWeb (Frontend)

Aplicação web para gestão de um sistema hospitalar com perfis de paciente, médico e administrador. Este repositório contém o frontend em React + Vite.

Backend: https://github.com/luad3cristal/medSystemAPI

## Stack

- React + Vite
- React Router
- SCSS
- Fetch API

## Funcionalidades

### Gerais

- Autenticação (login) e registro de paciente/médico
- Aprovação obrigatória de novos cadastros por um administrador antes do primeiro login
- Rotas protegidas por autenticação e papel (ADMIN, DOCTOR, PATIENT)
- Perfil do usuário com dados pessoais, endereço e status

### Paciente

- Cria suas próprias consultas
- Visualiza suas consultas e status
- Cancela consultas com motivo e regra de antecedência
- Edita seus dados pessoais e endereço

### Médico

- Visualiza suas consultas
- Conclui consultas agendadas
- Cancela consultas com motivo e regra de antecedência
- Edita seus dados pessoais e endereço

### Admin

- Acesso a todos os dados do sistema
- Lista pacientes e médicos
- Ativa/inativa perfis de pacientes e médicos
- Aprova ou recusa novos cadastros (usuários pendentes)
- Gerencia consultas (criar, concluir e cancelar)

## Regras de negócio para consultas

- Atendimentos de segunda a sábado
- Horários permitidos entre 07:00 e 18:00
- Agendamento com pelo menos 30 minutos de antecedência
- Paciente não pode ter duas consultas no mesmo dia
- Médico não pode ter duas consultas no mesmo horário
- Cancelamento apenas com 24h de antecedência e motivo informado
- Médico pode ser opcional no agendamento (atribuição automática quando disponível)

## Rotas principais

- /login
- /register/pacient
- /register/doctor
- /medicos (listagem de médicos; ações administrativas quando ADMIN)
- /pacientes (ADMIN)
- /consultas (ADMIN)
- /pendentes (ADMIN)
- /profile

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
- As permissões variam conforme o papel do usuário (ADMIN, DOCTOR, PATIENT).
