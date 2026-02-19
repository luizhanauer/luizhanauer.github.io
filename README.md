# 🛠 Tools & Lab

Portfólio dinâmico desenvolvido com **Vue 3**, **Vite** e **Tailwind CSS v4**, projetado para listar e categorizar ferramentas e experimentos open-source via API do GitHub.

## 🚀 Tecnologias e Princípios

Este projeto foi migrado de uma estrutura estática para uma arquitetura moderna, focando em:

* **Vue 3 (Composition API)**: Reatividade eficiente e modular.
* **Vite**: Build pipeline ultra-rápido.
* **Tailwind CSS v4**: Estilização baseada em variáveis CSS e alta performance.
* **TypeScript**: Tipagem estrita para maior segurança e robustez do código.
* **Clean Code & SOLID**: Lógica de negócio desacoplada em Composables e componentes de responsabilidade única.
* **Object Calisthenics**: Código legível com baixa indentação e métodos focados.

## 📋 Funcionalidades

* **Sincronização com GitHub**: Lista automaticamente repositórios baseados em tópicos configuráveis.
* **Destaques Dinâmicos**: Projetos com a tag `featured` ganham destaque visual no grid.
* **Tematização via JSON**: Cores, fontes e comportamento de partículas são controlados por um único arquivo `config.json`.
* **Background Animado**: Sistema de partículas em Canvas que reage dinamicamente às cores do tema.

## ⚙️ Configuração

O comportamento do portfólio é definido no arquivo `public/config.json`:

```json
{
  "profile": {
    "username": "luizhanauer",
    "pageTitle": "Tools & Lab",
    "tagFilter": "portfolio-tool"
  },
  "theme": {
    "colors": {
      "bg": "#0d1117",
      "accent": "#58a6ff"
    }
  }
}

```

## 🛠 Desenvolvimento

Para rodar o projeto localmente no seu ambiente **Ubuntu**:

```bash
# Instalar dependências
npm install

# Rodar em modo dev
npm run dev

# Gerar build de produção
npm run build

```

