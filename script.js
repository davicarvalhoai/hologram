// Função para adicionar mensagens à interface
function addMessage(sender, message) {
  const messagesContainer = document.getElementById('messages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.textContent = message;
  messagesContainer.appendChild(messageElement);

  // Rolar automaticamente para a última mensagem
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

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

// Função para enviar solicitações à API do Qwen
async function callQwenAPI(userInput) {
  const apiKey = 'SUA_NOVA_API_KEY_AQUI'; // Substitua pela sua nova chave secreta <button class="citation-flag" data-index="4">
  const apiUrl = 'https://api.qwen.com/v1/chat'; // Endpoint da API

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: userInput,
        max_tokens: 50
      })
    });

    if (!response.ok) throw new Error('Erro ao processar resposta do Qwen');

    const data = await response.json();
    return data.response || 'Desculpe, não consegui entender.';
  } catch (error) {
    console.error('Erro ao chamar a API do Qwen:', error);
    return 'Ocorreu um erro ao processar sua solicitação.';
  }
}

// Função para processar a entrada do usuário e interagir com o chatbot
document.getElementById('send-button').addEventListener('click', async () => {
  const input = document.getElementById('chat-input');
  const userMessage = input.value.trim();

  if (!userMessage) return alert('Por favor, digite uma mensagem.');

  // Adicionar mensagem do usuário à interface
  addMessage('user', userMessage);

  // Limpar o campo de entrada
  input.value = '';

  try {
    // Chamar a API do Qwen
    const answer = await callQwenAPI(userMessage);

    // Adicionar resposta do bot à interface
    addMessage('bot', answer);

    // Gerar áudio e sincronizar lábios
    generateAudio(answer);
  } catch (error) {
    console.error('Erro ao processar chatbot:', error);
  }
});

// Permitir envio ao pressionar Enter
document.getElementById('chat-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('send-button').click();
  }
});
