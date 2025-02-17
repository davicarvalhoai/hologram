// Função para escolher animações aleatórias
function playRandomAnimation() {
  const animations = ['smile', 'wave', 'idle'];
  const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
  const avatar = document.getElementById('avatar-video'); // Alterado de 'avatar-static' para 'avatar-video'
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
  const avatar = document.getElementById('avatar-video'); // Alterado de 'avatar-static' para 'avatar-video'
  avatar.style.transform = `rotate(${window.scrollY * 0.1}deg)`;
});

// Exibir mensagem inicial ao carregar o site
document.addEventListener('DOMContentLoaded', () => {
  const messageBox = document.getElementById('message-box');
  messageBox.style.display = 'block';
  setTimeout(() => {
    messageBox.style.display = 'none';
  }, 3000);
});

// Função para gerar áudio com IA
async function generateAudio(text) {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/voice-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': 'sua-chave-de-api-aqui'
      },
      body: JSON.stringify({
        text: text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.7
        }
      })
    });
    if (!response.ok) throw new Error('Erro ao gerar áudio');
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    syncLips(audio.duration * 1000);
  } catch (error) {
    console.error('Erro ao processar áudio:', error);
  }
}

// Função para sincronizar os lábios
function syncLips(duration) {
  const avatar = document.getElementById('avatar-video'); // Alterado de 'avatar-static' para 'avatar-video'
  avatar.style.transform = 'scaleY(0.9)';
  setTimeout(() => {
    avatar.style.transform = 'scaleY(1)';
  }, duration);
}

// Função para processar a entrada do usuário
document.getElementById('send-button').addEventListener('click', async () => {
  const input = document.getElementById('chat-input').value;
  if (!input.trim()) return alert('Por favor, digite uma mensagem.');
  try {
    const response = await fetch('https://api.dialogflow.com/v1/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sua-chave-de-api-aqui'
      },
      body: JSON.stringify({
        query: input,
        lang: 'pt-br',
        sessionId: '123456'
      })
    });
    if (!response.ok) throw new Error('Erro ao processar resposta do chatbot');
    const data = await response.json();
    const answer = data.result.fulfillment.speech;
    alert(answer);
    generateAudio(answer);
  } catch (error) {
    console.error('Erro ao processar chatbot:', error);
  }
});

// Função para criar partículas flutuantes dinâmicas
function createParticles() {
  const container = document.getElementById('avatar-container');
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
    container.appendChild(particle);
  }
}
createParticles();

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
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault();
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      const maxX = window.innerWidth - element.offsetWidth;
      const maxY = window.innerHeight - element.offsetHeight;
      element.style.position = 'absolute';
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
