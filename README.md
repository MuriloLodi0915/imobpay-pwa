# 🏠 ImobPay - Sistema de Gestão Financeira de Imóveis

Um aplicativo web moderno e responsivo para gestão financeira de imóveis alugados, desenvolvido com React, TypeScript e TailwindCSS.

## ✨ Funcionalidades

- 🔐 **Sistema de Login Seguro**
- 📊 **Dashboard Interativo** com gráficos e estatísticas
- 🏢 **Gestão de Imóveis** (Cadastrar, Editar, Remover)
- 👥 **Gestão de Inquilinos** (Cadastrar, Editar, Remover)
- 📄 **Gestão de Contratos** de locação
- 💰 **Sistema Financeiro** completo
- 📈 **Relatórios** detalhados
- 🌓 **Tema Claro/Escuro** com persistência
- 📱 **Design Responsivo** para todas as telas
- ⚡ **Interface Moderna** e intuitiva

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **TailwindCSS** para estilização
- **React Router** para navegação
- **Recharts** para gráficos
- **Lucide React** para ícones
- **Date-fns** para manipulação de datas

## 🚀 Como Executar

### Pré-requisitos

- Node.js 16+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd imobpay
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm start
```

4. Acesse no navegador:
```
http://localhost:3000
```

### Credenciais de Teste

- **Email:** admin@imobpay.com
- **Senha:** admin123

## 📱 Funcionalidades Principais

### Dashboard
- Visão geral dos dados financeiros
- Gráficos de receita vs despesas
- Status dos imóveis
- Pagamentos recentes
- Alertas do sistema

### Gestão de Imóveis
- Cadastro completo de propriedades
- Diferentes tipos (Apartamento, Casa, Comercial)
- Status de disponibilidade
- Informações detalhadas

### Gestão de Inquilinos
- Cadastro de inquilinos
- Contatos de emergência
- Histórico de contratos

### Sistema Financeiro
- Controle de pagamentos
- Alertas de vencimento
- Geração de recibos
- Relatórios financeiros

### Tema Escuro/Claro
- Alternância suave entre temas
- Persistência da preferência
- Design adaptativo

## 🎨 Design System

O projeto utiliza um design system consistente com:

- **Cores:** Paleta personalizada com suporte a tema escuro
- **Tipografia:** Fonte Inter para melhor legibilidade
- **Componentes:** Reutilizáveis e acessíveis
- **Animações:** Transições suaves e feedback visual

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Contextos React (Auth, Theme)
├── data/              # Dados mock para demonstração
├── pages/             # Páginas da aplicação
├── types/             # Definições TypeScript
├── App.tsx            # Componente principal
├── index.tsx          # Ponto de entrada
└── index.css          # Estilos globais
```

## 🔧 Scripts Disponíveis

- `npm start` - Executa o projeto em modo desenvolvimento
- `npm build` - Gera build de produção
- `npm test` - Executa os testes
- `npm eject` - Ejecta do Create React App

## 🌟 Próximas Funcionalidades

- [ ] Integração com banco de dados real
- [ ] Sistema de notificações push
- [ ] Exportação de relatórios em PDF
- [ ] App mobile nativo
- [ ] Integração com sistemas de pagamento
- [ ] Módulo de manutenções

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvido com ❤️

Sistema desenvolvido com foco em usabilidade, performance e design moderno para facilitar a gestão financeira de imóveis.

## 🎨 Personalização da Logo

Para adicionar a logo real do ImobPay:

1. Coloque o arquivo da logo na pasta `public/` com o nome `ImobPayLogo.png`
2. Atualize os componentes `LoginForm.tsx`, `RegisterForm.tsx` e `Layout.tsx` para usar:
```jsx
<img src="/ImobPayLogo.png" alt="ImobPay Logo" className="h-12 w-auto" />
```

Atualmente o sistema usa um placeholder com gradiente e as iniciais "IP". 

# ImobPay Desktop

Sistema de Gestão Financeira de Imóveis - Aplicativo Desktop

## 📋 Descrição

O ImobPay Desktop é uma aplicação desktop desenvolvida com Electron que oferece uma interface nativa para o sistema de gestão financeira de imóveis alugados. Com todas as funcionalidades da versão web, mas com a conveniência de um aplicativo desktop.

## ✨ Funcionalidades

- **Dashboard Interativo**: Visão geral das finanças com gráficos e estatísticas
- **Gestão de Imóveis**: Cadastro e controle completo de propriedades
- **Gestão de Inquilinos**: Dados dos locatários e histórico
- **Contratos**: Criação e acompanhamento de contratos de locação
- **Financeiro**: Controle de receitas, despesas e pagamentos
- **Relatórios**: Geração de relatórios detalhados com exportação
- **Tema Escuro/Claro**: Interface adaptável às preferências do usuário
- **Persistência Local**: Dados salvos localmente no computador

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone ou baixe o projeto
2. Navegue até o diretório do projeto:
   ```bash
   cd ImobPay-Desktop
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

### Desenvolvimento

Para executar em modo de desenvolvimento:
```bash
npm start
```

Isso irá:
- Iniciar o servidor de desenvolvimento React na porta 3000
- Abrir o aplicativo Electron automaticamente
- Habilitar as ferramentas de desenvolvimento

### Build para Produção

Para criar um executável do aplicativo:

```bash
# Build para Windows
npm run dist:win

# Build para todas as plataformas
npm run dist
```

Os arquivos executáveis serão gerados na pasta `dist/`.

## 📁 Estrutura do Projeto

```
ImobPay-Desktop/
├── electron/           # Código do Electron
│   └── main.js        # Processo principal
├── public/            # Arquivos públicos
│   ├── index.html     # HTML principal
│   └── ImobPayLogo.png # Logo do sistema
├── src/               # Código React
│   ├── components/    # Componentes reutilizáveis
│   ├── contexts/      # Contextos React
│   ├── pages/         # Páginas da aplicação
│   ├── types/         # Definições TypeScript
│   └── data/          # Dados mockados
├── package.json       # Configurações e dependências
└── README.md         # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **Electron**: Framework para aplicações desktop
- **React**: Biblioteca para interface do usuário
- **TypeScript**: Linguagem de programação tipada
- **TailwindCSS**: Framework CSS utilitário
- **Recharts**: Biblioteca para gráficos
- **React Router**: Roteamento da aplicação
- **Lucide React**: Ícones modernos

## 📦 Distribuição

O aplicativo pode ser distribuído como:

- **Instalador Windows (.exe)**: Criado com electron-builder
- **Portable**: Executável que não requer instalação
- **AppImage** (Linux): Para sistemas Linux

## 🔧 Configurações

### Personalização do Build

Edite o arquivo `package.json` na seção `build` para personalizar:

- Nome do aplicativo
- Ícone
- Configurações de instalação
- Opções de distribuição

### Configurações do Electron

O arquivo `electron/main.js` contém as configurações principais:

- Tamanho da janela
- Configurações de segurança
- Menu da aplicação
- Comportamento da janela

## 🐛 Solução de Problemas

### Erro de Política de Execução (PowerShell)

Se encontrar erro de política de execução no PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Dependências não encontradas

Se houver problemas com dependências:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build falhando

Para problemas de build:

```bash
npm run build
npm run dist:win
```

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e comerciais.

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para suporte ou dúvidas, entre em contato através dos canais oficiais do ImobPay.

---

**ImobPay Desktop** - Transformando a gestão imobiliária em uma experiência desktop moderna e eficiente. 

<!-- Trigger redeploy Vercel -->