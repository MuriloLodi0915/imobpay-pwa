# ImobPay PWA - Sistema de Gestão Imobiliária

## 📱 Sobre o PWA

O ImobPay PWA (Progressive Web App) é uma versão otimizada do sistema de gestão imobiliária que pode ser instalada como um aplicativo nativo em dispositivos móveis e desktop.

## ✨ Funcionalidades PWA

### 🔧 Funcionalidades Básicas
- **Instalação como App**: Pode ser instalado na tela inicial do dispositivo
- **Funcionamento Offline**: Funciona mesmo sem conexão com a internet
- **Sincronização**: Sincroniza dados quando a conexão é restaurada
- **Notificações Push**: Receba notificações importantes
- **Interface Nativa**: Parece e funciona como um app nativo

### 📊 Funcionalidades do Sistema
- **Dashboard**: Visão geral do negócio
- **Gestão de Propriedades**: Cadastro e controle de imóveis
- **Gestão de Inquilinos**: Cadastro e histórico de inquilinos
- **Contratos**: Gerenciamento de contratos de aluguel
- **Financeiro**: Controle de receitas e despesas
- **Relatórios**: Relatórios detalhados do negócio

## 🚀 Como Instalar

### No Desktop (Chrome/Edge)
1. Acesse o site do ImobPay
2. Clique no ícone de instalação na barra de endereços
3. Clique em "Instalar"
4. O app será instalado e aparecerá no menu iniciar

### No Mobile (Android)
1. Acesse o site no Chrome
2. Toque no menu (três pontos)
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

### No Mobile (iOS)
1. Acesse o site no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start

# Build para produção
npm run build

# Build PWA completo
npm run build:pwa

# Servir build de produção
npm run serve:pwa
```

### Estrutura PWA
```
pwa-imobpay/
├── public/
│   ├── manifest.json          # Manifesto PWA
│   ├── sw.js                  # Service Worker
│   ├── offline.html           # Página offline
│   ├── icon-*.png             # Ícones PWA
│   └── index.html             # HTML principal
├── src/
│   ├── hooks/
│   │   └── usePWA.ts          # Hook PWA
│   ├── components/
│   │   ├── PWAInstallBanner.tsx   # Banner de instalação
│   │   └── OfflineIndicator.tsx   # Indicador offline
│   └── ...
└── scripts/
    └── generate-icons.js      # Gerador de ícones
```

## 📱 Funcionalidades Técnicas

### Service Worker
- Cache inteligente de recursos
- Funcionamento offline
- Sincronização em background
- Notificações push

### Manifesto PWA
- Configuração de instalação
- Ícones e cores do tema
- Shortcuts para funcionalidades
- Configurações de display

### Hook usePWA
- Detecção de instalação
- Gerenciamento de notificações
- Sincronização de dados
- Status de conectividade

## 🔧 Configuração

### Variáveis de Ambiente
```env
REACT_APP_PWA_NAME=ImobPay
REACT_APP_PWA_SHORT_NAME=ImobPay
REACT_APP_PWA_DESCRIPTION=Sistema de gestão imobiliária
REACT_APP_PWA_THEME_COLOR=#3b82f6
```

### Personalização
- Edite `public/manifest.json` para personalizar o manifesto
- Modifique `public/sw.js` para ajustar o cache
- Atualize os ícones em `public/icon-*.png`

## 📊 Testes PWA

### Lighthouse
1. Abra o DevTools (F12)
2. Vá para a aba "Lighthouse"
3. Execute o teste PWA
4. Verifique a pontuação (deve ser 90+)

### Funcionalidades
- [ ] Instalação funciona
- [ ] App funciona offline
- [ ] Notificações funcionam
- [ ] Sincronização funciona
- [ ] Interface responsiva

## 🚀 Deploy

### Build de Produção
```bash
npm run build:pwa
```

### Servidor de Produção
```bash
npm run serve:pwa
```

### Configuração do Servidor
Certifique-se de que o servidor:
- Sirva o `manifest.json` com `Content-Type: application/manifest+json`
- Configure HTTPS (obrigatório para PWA)
- Configure headers de cache adequados

## 📝 Notas Importantes

### HTTPS
PWAs requerem HTTPS em produção. Para desenvolvimento local, `localhost` é aceito.

### Ícones
Os ícones atuais são SVGs. Para produção, converta para PNG otimizados.

### Cache
O Service Worker implementa cache-first strategy. Ajuste conforme necessário.

### Notificações
As notificações requerem permissão do usuário e HTTPS.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o PWA:
- Abra uma issue no GitHub
- Consulte a documentação
- Entre em contato com a equipe de desenvolvimento 