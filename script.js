// Função para escolher animações aleatórias
function playRandomAnimation() {
  const animations = ['smile', 'wave', 'idle'];
  const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
  const avatar = document.getElementById('avatar-static');
  if (randomAnimation === 'smile') {
    avatar.style.transform = 'scaleY(0.9)';
    setTimeout(() => {
      avatar.style.transform = 'scaleY(1)';
    }, 1000);
  } else if (randomAnimation === 'wave') {
    avatar.style.transform = 'rotate(-10deg)';
    setTimeout(() => {
      avatar.style.transform = 'rotate(0deg)';
    }, 1000);
  } else {
    avatar.style.transform = 'rotate(2deg)';
    setTimeout(() => {
      avatar.style.transform = 'rotate(-2deg)';
    }, 500);
  }
}

// Iniciar animações aleatórias a cada 5 segundos
setInterval(playRandomAnimation, 5000);

// Função para fazer o avatar reagir ao scroll
window.addEventListener('scroll', () => {
  console.log('Scroll detectado'); // Verifica se o evento está sendo acionado
  const avatar = document.getElementById('avatar-static');
  if (!avatar) {
    console.error('Elemento #avatar-static não encontrado no DOM.');
    return;
  }
  avatar.style.transform = `rotate(${window.scrollY * 0.1}deg)`; // Apenas altera a rotação
});

// Exibir mensagem inicial ao carregar o site
document.addEventListener('DOMContentLoaded', () => {
  const messageBox = document.getElementById('message-box');
  messageBox.style.display = 'block';
  setTimeout(() => {
    messageBox.style.display = 'none';
  }, 3000);
});

// Função genérica para tornar um elemento arrastável
function makeElementDraggable(elementId) {
  const element = document.getElementById(elementId);
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  element.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    element.style.cursor = 'grabbing';
    element.style.position = 'fixed'; // Altera para fixed ao iniciar o arrasto <button class="citation-flag" data-index="1">
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault();
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      const maxX = window.innerWidth - element.offsetWidth;
      const maxY = window.innerHeight - element.offsetHeight;
      element.style.left = `${Math.min(Math.max(x, 0), maxX)}px`;
      element.style.top = `${Math.min(Math.max(y, 0), maxY)}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    element.style.cursor = 'grab';
  });

  element.addEventListener('mouseenter', () => {
    element.style.cursor = 'grab';
  });

  element.addEventListener('mouseleave', () => {
    element.style.cursor = 'default';
  });
}

// Inicializar a funcionalidade de arrastar para o avatar e a caixa de diálogo
makeElementDraggable('avatar-container');
makeElementDraggable('chat-container');
