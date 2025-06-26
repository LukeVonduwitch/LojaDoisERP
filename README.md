# Vestuário ERP

Bem-vindo ao Vestuário ERP, um sistema de gestão completo e moderno, projetado especificamente para as necessidades de lojas de vestuário. Esta aplicação foi desenvolvida para fornecer uma interface intuitiva e poderosa para gerenciar todos os aspectos do seu negócio de moda, desde o controle de estoque até o relacionamento com o cliente.

O projeto é construído com as tecnologias mais recentes para garantir uma experiência de usuário rápida, responsiva e agradável.

## ✨ Core Features (Funcionalidades Principais)

O Vestuário ERP foi projetado com um conjunto robusto de funcionalidades para otimizar a gestão da sua loja:

- **Painel Intuitivo (`/`):** Um dashboard central que oferece uma visão geral e rápida das métricas mais importantes do seu negócio, como o número total de clientes.
- **Gestão de Estoque (`/stock`):**
  - Rastreamento em tempo real dos níveis de estoque.
  - Insights sobre produtos com maior saída, maior rentabilidade e que precisam de reposição.
  - Edição rápida de margem de lucro (markup) e visualização do impacto no preço final e na rentabilidade.
  - Adição e gerenciamento de produtos com detalhes como SKU, categoria, fornecedor e imagem.
- **Gestão de Relacionamento com o Cliente (CRM) (`/clientes`):**
  - Banco de dados completo de clientes com informações de contato, dados pessoais e endereço.
  - Histórico de compras, total gasto e preferências de estilo e tamanho.
  - Funcionalidades de adicionar, editar e excluir clientes.
- **Configurações Flexíveis:**
  - **Configurações da Aplicação (`/settings`):** Personalize a identidade visual do ERP, incluindo nome do aplicativo, logo, tema (Claro, Escuro, e os exclusivos Liquid Glass), e dados do usuário (nome e avatar).
  - **Configurações de API (`/api-settings`):** Gerencie as credenciais para integrações com APIs externas, como a de autenticação e, futuramente, com bancos de dados como o Baserow.

## 🚀 Tech Stack (Tecnologias Utilizadas)

Esta aplicação utiliza um conjunto de tecnologias moderno e escalável:

- **Framework Principal:** [Next.js](https://nextjs.org/) (utilizando o App Router para roteamento otimizado e Server Components).
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) para um código mais seguro e manutenível.
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) para uma estilização utilitária e consistente.
- **Componentes de UI:** [ShadCN UI](https://ui.shadcn.com/) para uma biblioteca de componentes bonita, acessível e personalizável.
- **Gestão de Estado:** Hooks nativos do React (`useState`, `useEffect`, `useContext`, `useMemo`) e a Context API para gerenciamento de temas e estado da UI.
- **Persistência de Dados no Cliente:** A API `localStorage` do navegador é utilizada para persistir configurações da aplicação, dados do usuário, credenciais de API e informações de produtos, garantindo que as personalizações e dados não se percam ao recarregar a página.
- **Ícones:** [Lucide React](https://lucide.dev/) para uma coleção de ícones nítidos e consistentes.
- **Inteligência Artificial:** [Genkit](https://firebase.google.com/docs/genkit) (integrado e pronto para futuras implementações de funcionalidades baseadas em IA).
- **Deployment:** Configurado para [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

## 🛠️ Getting Started (Como Começar)

Siga os passos abaixo para executar o projeto em seu ambiente de desenvolvimento local.

### Pré-requisitos

Certifique-se de que você tem o [Node.js](https://nodejs.org/) (versão 18 ou superior) instalado em sua máquina.

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DA_PASTA>
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

### Executando a Aplicação

Para iniciar o servidor de desenvolvimento, execute o seguinte comando:

```bash
npm run dev
```

Isso iniciará a aplicação em modo de desenvolvimento com o Turbopack, tornando-a acessível em [http://localhost:9002](http://localhost:9002). O aplicativo será recarregado automaticamente sempre que você fizer alterações nos arquivos.

## 📁 Project Structure (Estrutura do Projeto)

A estrutura de pastas do projeto foi organizada para ser intuitiva e escalável:

```
.
├── src/
│   ├── app/                # Páginas da aplicação (App Router)
│   │   ├── api-settings/   # Página de configurações de API
│   │   ├── clientes/       # Página de gestão de clientes (CRM)
│   │   ├── login/          # Página de login
│   │   ├── settings/       # Página de configurações gerais
│   │   ├── stock/          # Página de gestão de estoque
│   │   ├── globals.css     # Estilos globais e variáveis de tema
│   │   ├── layout.tsx      # Layout principal da aplicação
│   │   └── page.tsx        # Página inicial (Dashboard)
│   ├── components/
│   │   ├── ui/             # Componentes base do ShadCN UI
│   │   ├── icons/          # Ícones SVG personalizados (ex: Logo)
│   │   └── layout/         # Componentes de layout (Sidebar, Header, AppShell)
│   ├── hooks/              # Hooks React personalizados (ex: useToast)
│   ├── lib/                # Funções utilitárias (ex: cn)
│   └── ai/                 # Configuração do Genkit para IA
├── public/                 # Arquivos estáticos (não utilizado atualmente)
├── package.json            # Dependências e scripts do projeto
├── tailwind.config.ts      # Configuração do Tailwind CSS
└── tsconfig.json           # Configuração do TypeScript
```

## ⚙️ Configuração

A aplicação armazena grande parte de suas configurações e dados diretamente no `localStorage` do navegador para persistência.

-   **Autenticação:** Uma autenticação simulada é gerenciada através da chave `vestuario-auth`.
-   **Configurações da API:** As credenciais da API externa são salvas na chave `vestuario-erp-api-settings`.
-   **Configurações da Aplicação:** As personalizações de tema, nome, avatar, etc., são salvas em `vestuario-erp-app-settings`.
-   **Dados de Produtos:** A lista de produtos é mantida sob a chave `vestuario-erp-products`.
-   **Dados de Clientes:** Os dados de clientes são buscados da API SheetDB. As credenciais da API estão atualmente hardcoded, mas a infraestrutura está pronta para se conectar a um backend mais robusto como o Baserow.

## 📜 Available Scripts (Scripts Disponíveis)

No `package.json`, você encontrará os seguintes scripts:

-   `npm run dev`: Inicia o servidor de desenvolvimento.
-   `npm run build`: Compila a aplicação para produção.
-   `npm run start`: Inicia um servidor de produção.
-   `npm run lint`: Executa o linter (ESLint) para verificar a qualidade do código.
-   `npm run typecheck`: Executa o compilador TypeScript para verificar os tipos sem gerar arquivos.

## 🎨 Guia de Estilo

O design do aplicativo segue as seguintes diretrizes de cores, definidas em `src/app/globals.css`:

-   **Cor Primária:** Azul Suave (`#64B5F6`)
-   **Cor de Fundo:** Cinza Claro (`#F0F4F8`)
-   **Cor de Destaque (Accent):** Verde-azulado (`#26A69A`)
-   **Fonte:** 'PT Sans'

A aplicação também suporta múltiplos temas, incluindo um tema escuro e os temas "Liquid Glass", que podem ser selecionados na página de Configurações.
