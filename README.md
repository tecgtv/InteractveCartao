# Cartão Interativo — Motorista Welmington

Projeto estático pronto para GitHub Pages.

## Estrutura

```text
index.html
README.md
.gitignore
reviews.json
assent/
├── css/
│   └── style.css
├── imagem/
│   ├── frontal.jpg
│   ├── verso.jpg
│   ├── informacao-1.jpg
│   ├── informacao-2.jpg
│   └── informacao-3.jpg
└── js/
    └── script.js
```

## Avaliações

A página principal possui um resumo com estrelas e o botão **Avaliações**. O botão abre uma janela própria com animação de descida, escolha de 1 a 5 estrelas, nome, comentário, lista de avaliações e exportação para `reviews.json`.

### Sobre salvar no GitHub

O GitHub Pages serve arquivos estáticos. Por segurança, uma página publicada não pode alterar automaticamente `reviews.json` dentro do repositório sem autenticação e um serviço de servidor/backend. Nesta versão, as avaliações ficam salvas no `localStorage` do navegador e podem ser exportadas para `reviews.json` para depois serem adicionadas ao repositório.

Para ter **salvamento automático e compartilhado entre todos os visitantes**, a próxima etapa é conectar o formulário a um backend/banco (por exemplo, Supabase, Firebase ou uma API própria). Não coloque um token pessoal do GitHub diretamente no JavaScript do site.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todo o conteúdo desta pasta, mantendo a estrutura.
3. Em **Settings → Pages**, selecione a branch principal e a pasta `/ (root)`.
4. Salve e aguarde a publicação.

O arquivo inicial é `index.html`.
