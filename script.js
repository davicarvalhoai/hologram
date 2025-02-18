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

// Função para processar a entrada do usuário
document.getElementById('send-button').addEventListener('click', async () => {
  const input = document.getElementById('chat-input').value;
  if (!input.trim()) return alert('Por favor, digite uma mensagem.');

  try {
    // Adiciona a mensagem do usuário à caixa de diálogo
    addMessageToChat(input, 'user-message');

    // Enviar mensagem ao chatbot
    const answer = await sendMessageToChatbot(input);

    // Adiciona a resposta do chatbot à caixa de diálogo
    addMessageToChat(answer, 'bot-message');

    // Limpa o campo de entrada
    document.getElementById('chat-input').value = '';
  } catch (error) {
    console.error('Erro ao processar chatbot:', error);
  }
});

// Função para adicionar mensagens à caixa de diálogo
function addMessageToChat(message, className) {
  const chatBody = document.getElementById('chat-body');
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', className);
  messageElement.textContent = message;
  chatBody.appendChild(messageElement);

  // Rola automaticamente para a última mensagem
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Função para enviar mensagem ao chatbot Qwen usando proxy CORS personalizado
async function sendMessageToChatbot(message) {
  const proxyUrl = 'https://hologram.davicarvalhodrive.workers.dev/?url='; // Proxy CORS personalizado <button class="citation-flag" data-index="1">
  const apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

  try {
    const response = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-37eca6f0da0445a49a424d9aa9fc9c27'
      },
      body: JSON.stringify({
        model: 'qwen',
        input: {
          prompt: message
        },
        parameters: {
          max_tokens: 100
        }
      })
    });

    if (!response.ok) throw new Error('Erro ao processar resposta do chatbot');
    const data = await response.json();
    return data.output.text;
  } catch (error) {
    console.error('Erro ao comunicar com o chatbot:', error);
    return 'Desculpe, ocorreu um erro ao processar sua solicitação.';
  }
}

// Função para gerar áudio com IA
async function generateAudio(text) {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/voice-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': 'sua-chave-de-api-elevenlabs-aqui' // Substitua pela sua chave ElevenLabs, se necessário
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
  const avatar = document.getElementById('avatar-static');
  avatar.style.transform = 'scaleY(0.9)';
  setTimeout(() => {
    avatar.style.transform = 'scaleY(1)';
  }, duration);
}

// Função genérica para tornar um elemento arrastável
function makeElementDraggable(elementId) {
  const element = document.getElementById(elementId);
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  element.addEventListener('mousedown', (e) => {
    // Ignora o evento se o clique for no campo de entrada
    if (e.target.id === 'chat-input') return;

    e.preventDefault();
    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    element.style.cursor = 'grabbing';
    element.style.position = 'fixed'; // Altera para fixed ao iniciar o arrasto
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
