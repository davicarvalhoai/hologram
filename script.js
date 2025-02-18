// Função para enviar mensagem ao chatbot
async function sendMessageToChatbot(message) {
  const baseUrl = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'; // Base URL compatível com OpenAI <button class="citation-flag" data-index="1">
  const apiKey = 'sk-37eca6f0da0445a49a424d9aa9fc9c27'; // Substitua pela sua chave de API

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, { // Endpoint específico para geração de texto
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen', // Modelo Qwen
        messages: [
          { role: 'user', content: message } // Mensagem do usuário
        ],
        max_tokens: 100 // Número máximo de tokens na resposta
      })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content; // Retorna a resposta do chatbot
  } catch (error) {
    console.error('Erro ao comunicar com o chatbot:', error);
    return 'Desculpe, ocorreu um erro ao processar sua solicitação.';
  }
}

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

// Evento de envio do formulário
document.getElementById('send-button').addEventListener('click', async () => {
  const input = document.getElementById('chat-input').value.trim();
  if (!input) return alert('Por favor, digite uma mensagem.'); // Validação simples <button class="citation-flag" data-index="6">

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

// Carregar dados salvos em cookies ao carregar a página (opcional)
function loadFromCookies() {
  const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});

  // Preenche os campos do formulário com os cookies salvos
  if (cookies.chatHistory) {
    const chatBody = document.getElementById('chat-body');
    chatBody.innerHTML = cookies.chatHistory; // Restaura o histórico de mensagens
  }
}

// Salvar dados em cookies (opcional)
function saveToCookies() {
  const chatBody = document.getElementById('chat-body');
  document.cookie = `chatHistory=${encodeURIComponent(chatBody.innerHTML)}; path=/; max-age=3600`; // Salva o histórico por 1 hora <button class="citation-flag" data-index="5">
}

// Carrega o histórico de mensagens ao carregar a página
loadFromCookies();

// Salva o histórico de mensagens ao fechar a página
window.addEventListener('beforeunload', () => {
  saveToCookies();
});
