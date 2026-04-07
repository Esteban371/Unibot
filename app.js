async function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value;

  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [
        { role: "user", content: text }
      ]
    })
  });

  const data = await res.json();

  // 👇 SOLUCIÓN CLAVE
  if (data.reply) {
    addMessage(data.reply, "bot");
  } else if (data.error) {
    addMessage("❌ Error: " + JSON.stringify(data.error), "bot");
  } else {
    addMessage("⚠️ Sin respuesta del servidor", "bot");
  }
}
