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
  const avatar = document.getElementById('avatar-static');
  avatar.style.transform = `rotate(${window.scrollY * 0.1}deg)`;
});

// Exibir mensagem inicial ao carregar o site
document.addEventListener('DOMContentLoaded', () => {
  const messageBox = document.getElementById('message-box');
  messageBox.style.display = 'block';

  // Esconder mensagem após 3 segundos
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

    // Sincronizar lábios com o áudio
    syncLips(audio.duration * 1000);
  } catch (error) {
    console.error('Erro ao processar áudio:', error);
  }
}

// Função para sincronizar os lábios
function syncLips(duration) {
  const avatar = document.getElementById('avatar-static');
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
    // Enviar pergunta para a API do chatbot
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

    // Exibir resposta
    alert(answer);

    // Gerar áudio e sincronizar lábios
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

// Função para tornar o avatar e o chat arrastáveis
function makeAvatarDraggable() {
  const avatarChatContainer = document.getElementById('avatar-chat-container');
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  // Evento de início do arrasto (quando o usuário clica no avatar)
  avatarChatContainer.addEventListener('mousedown', (e) => {
    e.preventDefault(); // Impede o comportamento padrão de arrastar a imagem <button class="citation-flag" data-index="1">
    isDragging = true;
    offsetX = e.clientX - avatarChatContainer.getBoundingClientRect().left;
    offsetY = e.clientY - avatarChatContainer.getBoundingClientRect().top;
    avatarChatContainer.style.cursor = 'grabbing'; // Altera o cursor para indicar arrasto
  });

  // Evento de movimento do mouse (enquanto o usuário arrasta o avatar)
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault(); // Impede o comportamento padrão de arrastar a imagem <button class="citation-flag" data-index="1">
      const x = e.clientX - offsetX; // Calcula a posição horizontal
      const y = e.clientY - offsetY; // Calcula a posição vertical

      // Garantir que o elemento não saia dos limites da tela
      const maxX = window.innerWidth - avatarChatContainer.offsetWidth;
      const maxY = window.innerHeight - avatarChatContainer.offsetHeight;

      avatarChatContainer.style.position = 'absolute';
      avatarChatContainer.style.left = `${Math.min(Math.max(x, 0), maxX)}px`; // Limita o movimento horizontal
      avatarChatContainer.style.top = `${Math.min(Math.max(y, 0), maxY)}px`; // Limita o movimento vertical
    }
  });

  // Evento de término do arrasto (quando o usuário solta o clique)
  document.addEventListener('mouseup', () => {
    isDragging = false;
    avatarChatContainer.style.cursor = 'grab'; // Retorna o cursor ao estado normal
  });

  // Alterar o cursor ao passar sobre o avatar
  avatarChatContainer.addEventListener('mouseenter', () => {
    avatarChatContainer.style.cursor = 'grab'; // Cursor de "clicar e arrastar"
  });

  avatarChatContainer.addEventListener('mouseleave', () => {
    avatarChatContainer.style.cursor = 'default'; // Cursor padrão quando fora do avatar
  });
}

// Inicializar a funcionalidade de arrastar
makeAvatarDraggable();
