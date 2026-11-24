/* ==========================================================================
   script.js — Currículo Online de Gabriell Marques
   JavaScript puro (sem jQuery, React ou qualquer outra biblioteca).

   Funcionalidades:
    1. Tema claro/escuro, com a escolha salva no navegador (localStorage)
    2. Menu responsivo: abre e fecha no celular pelo botão "hambúrguer"
    3. Cabeçalho com sombra quando a página é rolada
    4. Ano atual no rodapé
    5. Filtro das disciplinas (página Formação): mostra/esconde itens por área
    6. Formulário de contato (página Contato): validação + envio simulado + modal

   Este arquivo é carregado no <head> SEM "defer" de propósito: assim o tema
   salvo é aplicado antes de a página ser desenhada (evita aquele "piscar" do
   tema claro para o escuro). Todo o resto só roda depois que o HTML terminou
   de carregar, dentro do evento DOMContentLoaded.
   ========================================================================== */


/* ==========================================================================
   1. TEMA CLARO / ESCURO
   ========================================================================== */

// Nome da chave usada para guardar a escolha do usuário no localStorage
const CHAVE_TEMA = 'gm-tema';

/**
 * Descobre qual tema usar ao abrir a página:
 * 1º a escolha salva anteriormente; 2º a preferência do sistema operacional.
 * @returns {'claro'|'escuro'}
 */
function obterTemaInicial() {
  let temaSalvo = null;

  // O localStorage pode estar bloqueado (ex.: alguns modos privados);
  // nesse caso o try/catch evita que o script inteiro pare.
  try {
    temaSalvo = localStorage.getItem(CHAVE_TEMA);
  } catch (erro) {
    temaSalvo = null;
  }

  if (temaSalvo === 'claro' || temaSalvo === 'escuro') {
    return temaSalvo;
  }

  // matchMedia lê a configuração de cores do sistema (prefers-color-scheme)
  const sistemaEscuro = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  return sistemaEscuro ? 'escuro' : 'claro';
}

/**
 * Aplica o tema colocando o atributo data-tema no elemento <html>.
 * O CSS troca as variáveis de cor a partir desse atributo.
 * @param {'claro'|'escuro'} tema
 */
function aplicarTema(tema) {
  document.documentElement.setAttribute('data-tema', tema);
}

// Executa imediatamente (antes do <body> existir) para não "piscar"
aplicarTema(obterTemaInicial());

/**
 * Liga o botão do cabeçalho que alterna entre os temas.
 */
function configurarBotaoTema() {
  const botaoTema = document.getElementById('tema-botao');
  if (!botaoTema) return;

  // Atualiza o texto lido por leitores de tela conforme o tema atual
  function atualizarRotulo() {
    const temaAtual = document.documentElement.getAttribute('data-tema');
    const proximo = temaAtual === 'escuro' ? 'claro' : 'escuro';
    botaoTema.setAttribute('aria-label', 'Ativar tema ' + proximo);
    botaoTema.setAttribute('title', 'Ativar tema ' + proximo);
  }

  botaoTema.addEventListener('click', function () {
    const temaAtual = document.documentElement.getAttribute('data-tema');
    const novoTema = temaAtual === 'escuro' ? 'claro' : 'escuro';

    aplicarTema(novoTema);
    atualizarRotulo();

    // Salva a escolha para as outras páginas e para a próxima visita
    try {
      localStorage.setItem(CHAVE_TEMA, novoTema);
    } catch (erro) {
      // Sem localStorage o tema ainda muda, só não fica salvo.
    }
  });

  atualizarRotulo();
}


/* ==========================================================================
   2. MENU RESPONSIVO (CELULAR)
   ========================================================================== */

// Largura a partir da qual o menu vira horizontal (igual à media query do CSS)
const LARGURA_MENU_DESKTOP = 820;

function configurarMenuMobile() {
  const botaoMenu = document.getElementById('menu-botao');
  const menu = document.getElementById('menu-principal');
  if (!botaoMenu || !menu) return;

  function abrirMenu() {
    menu.classList.add('menu--aberto');
    botaoMenu.setAttribute('aria-expanded', 'true');
    botaoMenu.setAttribute('aria-label', 'Fechar menu');
  }

  function fecharMenu() {
    menu.classList.remove('menu--aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
  }

  function menuEstaAberto() {
    return menu.classList.contains('menu--aberto');
  }

  // Clique no "hambúrguer": abre se estiver fechado e fecha se estiver aberto
  botaoMenu.addEventListener('click', function () {
    if (menuEstaAberto()) {
      fecharMenu();
    } else {
      abrirMenu();
    }
  });

  // Ao escolher um link, o menu fecha (útil para links da mesma página)
  const links = menu.querySelectorAll('a');
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', fecharMenu);
  }

  // Tecla Esc fecha o menu e devolve o foco ao botão
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && menuEstaAberto()) {
      fecharMenu();
      botaoMenu.focus();
    }
  });

  // Clique fora do menu (e fora do botão) também fecha
  document.addEventListener('click', function (evento) {
    const clicouDentro = menu.contains(evento.target) || botaoMenu.contains(evento.target);
    if (menuEstaAberto() && !clicouDentro) {
      fecharMenu();
    }
  });

  // Se a janela for alargada até o layout de computador, reseta o estado
  window.addEventListener('resize', function () {
    if (window.innerWidth >= LARGURA_MENU_DESKTOP && menuEstaAberto()) {
      fecharMenu();
    }
  });
}


/* ==========================================================================
   3. CABEÇALHO COM SOMBRA AO ROLAR
   ========================================================================== */
function configurarCabecalho() {
  const topo = document.getElementById('topo');
  if (!topo) return;

  function atualizarSombra() {
    // classList.toggle com segundo parâmetro: adiciona se true, remove se false
    topo.classList.toggle('topo--rolado', window.scrollY > 8);
  }

  window.addEventListener('scroll', atualizarSombra, { passive: true });
  atualizarSombra();
}


/* ==========================================================================
   4. ANO ATUAL NO RODAPÉ
   ========================================================================== */
function atualizarAnoRodape() {
  const ano = document.getElementById('ano-atual');
  if (ano) {
    ano.textContent = new Date().getFullYear();
  }
}


/* ==========================================================================
   5. FILTRO DAS DISCIPLINAS (formacao.html)
   Cada disciplina tem um atributo data-area. Ao clicar em um filtro,
   o script esconde (atributo hidden) as que não pertencem à área escolhida.
   ========================================================================== */
function configurarFiltroDisciplinas() {
  const botoes = document.querySelectorAll('.filtro__botao');
  const disciplinas = document.querySelectorAll('.disciplina');
  const contagem = document.getElementById('filtro-contagem');
  if (botoes.length === 0 || disciplinas.length === 0) return;

  function filtrar(area) {
    let visiveis = 0;

    for (let i = 0; i < disciplinas.length; i++) {
      const item = disciplinas[i];
      const mostrar = area === 'todas' || item.dataset.area === area;
      item.hidden = !mostrar;
      if (mostrar) visiveis++;
    }

    // Marca qual botão está selecionado (o CSS usa aria-pressed para pintar)
    for (let i = 0; i < botoes.length; i++) {
      const selecionado = botoes[i].dataset.area === area;
      botoes[i].setAttribute('aria-pressed', selecionado ? 'true' : 'false');
    }

    if (contagem) {
      contagem.textContent = 'Mostrando ' + visiveis + ' de ' + disciplinas.length +
        (disciplinas.length === 1 ? ' disciplina.' : ' disciplinas.');
    }
  }

  for (let i = 0; i < botoes.length; i++) {
    botoes[i].addEventListener('click', function () {
      filtrar(this.dataset.area);
    });
  }

  filtrar('todas');
}


/* ==========================================================================
   6. FORMULÁRIO DE CONTATO (contato.html)
   ========================================================================== */

// Expressão regular para o formato de e-mail: algo@dominio.extensao
// (sem espaços, um único @ e pelo menos um ponto no domínio).
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Regras de cada campo: tamanho mínimo e mensagens de erro em português
const REGRAS_CAMPOS = {
  nome: {
    minimo: 3,
    vazio: 'Informe o seu nome.',
    curto: 'O nome precisa ter pelo menos 3 letras.'
  },
  email: {
    vazio: 'Informe o seu e-mail.',
    invalido: 'Digite um e-mail válido, por exemplo: usuario@dominio.com.'
  },
  mensagem: {
    minimo: 10,
    vazio: 'Escreva a sua mensagem.',
    curto: 'A mensagem precisa ter pelo menos 10 caracteres.'
  }
};

/**
 * Valida um campo e devolve a mensagem de erro (ou '' se estiver correto).
 * @param {HTMLInputElement|HTMLTextAreaElement} campo
 * @returns {string}
 */
function validarCampo(campo) {
  const regra = REGRAS_CAMPOS[campo.name];
  const valor = campo.value.trim();   // trim() ignora espaços nas pontas

  if (!regra) return '';

  if (valor === '') {
    return regra.vazio;
  }

  if (campo.name === 'email' && !REGEX_EMAIL.test(valor)) {
    return regra.invalido;
  }

  if (regra.minimo && valor.length < regra.minimo) {
    return regra.curto;
  }

  return '';
}

/**
 * Mostra (ou limpa) o erro de um campo, ligando o texto ao campo
 * pelos atributos aria-invalid / aria-describedby (acessibilidade).
 * @returns {boolean} true se o campo está válido
 */
function exibirErro(campo, mensagem) {
  const elementoErro = document.getElementById('erro-' + campo.name);

  if (elementoErro) {
    elementoErro.textContent = mensagem;
  }

  if (mensagem) {
    campo.setAttribute('aria-invalid', 'true');
  } else {
    campo.removeAttribute('aria-invalid');
  }

  return mensagem === '';
}

function configurarFormularioContato() {
  const formulario = document.getElementById('form-contato');
  if (!formulario) return;

  const campos = formulario.querySelectorAll('input, textarea');
  const status = document.getElementById('form-status');
  const botaoEnviar = document.getElementById('botao-enviar');
  const textoOriginalBotao = botaoEnviar.textContent;
  const modal = document.getElementById('modal-sucesso');
  const botaoFecharModal = document.getElementById('modal-fechar');
  const mensagem = document.getElementById('mensagem');
  const contador = document.getElementById('contador-mensagem');

  // Depois da primeira tentativa de envio, os erros passam a ser
  // revalidados enquanto o usuário digita.
  let tentouEnviar = false;

  // ----- Contador de caracteres da mensagem -----
  function atualizarContador() {
    if (contador && mensagem) {
      contador.textContent = mensagem.value.length + ' / ' + mensagem.maxLength;
    }
  }

  if (mensagem) {
    mensagem.addEventListener('input', atualizarContador);
    atualizarContador();
  }

  // ----- Validação ao sair do campo (blur) e ao digitar (input) -----
  for (let i = 0; i < campos.length; i++) {
    const campo = campos[i];

    campo.addEventListener('blur', function () {
      // só reclama de campo vazio no blur se o usuário já digitou algo
      // ou se já tentou enviar — evita erro "do nada" ao passar pelo campo
      if (tentouEnviar || campo.value.trim() !== '') {
        exibirErro(campo, validarCampo(campo));
      }
    });

    campo.addEventListener('input', function () {
      if (tentouEnviar || campo.hasAttribute('aria-invalid')) {
        exibirErro(campo, validarCampo(campo));
      }
    });
  }

  // ----- Envio do formulário -----
  formulario.addEventListener('submit', function (evento) {
    // Impede o envio real: não há servidor, o envio é apenas simulado
    evento.preventDefault();
    tentouEnviar = true;

    let primeiroInvalido = null;
    let quantidadeErros = 0;

    for (let i = 0; i < campos.length; i++) {
      const valido = exibirErro(campos[i], validarCampo(campos[i]));
      if (!valido) {
        quantidadeErros++;
        if (!primeiroInvalido) primeiroInvalido = campos[i];
      }
    }

    // Há erros: mostra o resumo e leva o foco ao primeiro campo com problema
    if (quantidadeErros > 0) {
      status.textContent = quantidadeErros === 1
        ? 'Corrija o campo destacado para enviar a mensagem.'
        : 'Corrija os ' + quantidadeErros + ' campos destacados para enviar a mensagem.';
      status.hidden = false;
      primeiroInvalido.focus();
      return;
    }

    status.hidden = true;
    simularEnvio();
  });

  /**
   * Simula o envio: desabilita o botão por alguns instantes (como se
   * estivesse esperando o servidor), limpa os campos e abre o modal.
   */
  function simularEnvio() {
    botaoEnviar.disabled = true;
    botaoEnviar.textContent = 'Enviando...';

    setTimeout(function () {
      formulario.reset();              // limpa todos os campos
      tentouEnviar = false;
      for (let i = 0; i < campos.length; i++) {
        exibirErro(campos[i], '');
      }
      atualizarContador();

      botaoEnviar.disabled = false;
      botaoEnviar.textContent = textoOriginalBotao;

      abrirModal();
    }, 1200);
  }

  // ----- Modal de confirmação (<dialog>) -----
  function abrirModal() {
    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();               // abre como modal: bloqueia o fundo e aceita Esc
      botaoFecharModal.focus();
    } else {
      // Navegadores muito antigos sem <dialog>: usa um alerta simples
      alert('Mensagem enviada com sucesso!');
    }
  }

  if (modal) {
    botaoFecharModal.addEventListener('click', function () {
      modal.close();
    });

    // Clicar no fundo escurecido (fora da caixa) também fecha o modal
    modal.addEventListener('click', function (evento) {
      if (evento.target === modal) {
        modal.close();
      }
    });

    // Ao fechar, devolve o foco ao primeiro campo para uma nova mensagem
    modal.addEventListener('close', function () {
      campos[0].focus();
    });
  }
}


/* ==========================================================================
   INICIALIZAÇÃO
   Quando o HTML termina de carregar, liga cada funcionalidade.
   As funções conferem se os elementos existem na página atual, então o
   mesmo arquivo serve para as quatro páginas.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  configurarBotaoTema();
  configurarMenuMobile();
  configurarCabecalho();
  atualizarAnoRodape();
  configurarFiltroDisciplinas();
  configurarFormularioContato();
});
