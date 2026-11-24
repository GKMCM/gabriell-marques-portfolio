# Currículo Online — Gabriell Marques

Portfólio pessoal desenvolvido como Atividade Prática da disciplina **Aplicações Web e Móveis**
do Bacharelado em Engenharia de Software do Centro Universitário Internacional UNINTER.

**Site publicado:** https://gkmcm.github.io/gabriell-marques-portfolio/

## Tecnologias

- HTML5 semântico
- CSS3 puro (variáveis, Flexbox, Grid, media queries, transições), sem frameworks
- JavaScript puro (DOM e eventos), sem bibliotecas

## Páginas

| Arquivo          | Página    | Conteúdo                                                     |
|------------------|-----------|--------------------------------------------------------------|
| `index.html`     | Sobre mim | Apresentação, informações pessoais, hobbies                  |
| `formacao.html`  | Formação  | Formação acadêmica, disciplinas (com filtro), idiomas         |
| `portfolio.html` | Portfólio | Trabalhos realizados, com links                              |
| `contato.html`   | Contato   | Formulário com validação em JavaScript e envio simulado      |

## Funcionalidades em JavaScript (`js/script.js`)

- Menu responsivo: no celular, abre e fecha pelo botão do menu (fecha também com Esc ou tocando fora).
- Tema claro/escuro, com a escolha salva no navegador (`localStorage`).
- Filtro das disciplinas por área na página Formação.
- Formulário de contato: verifica se nome, e-mail e mensagem foram preenchidos e se o e-mail
  tem formato válido (`usuario@dominio.com`); depois simula o envio, limpa os campos e exibe
  a mensagem "Mensagem enviada com sucesso!" em uma caixa modal.

## Estrutura de pastas

```
├── index.html
├── formacao.html
├── portfolio.html
├── contato.html
├── css/
│   └── estilo.css
├── js/
│   └── script.js
└── img/
    ├── favicon.svg
    └── foto-gabriell.jpg
```

## Como abrir localmente

Basta abrir o arquivo `index.html` no navegador (não há etapa de build nem dependências).
