function addMessage(text, sender) {
  const chat = document.getElementById("chat");

  const div = document.createElement("div");
  div.className = sender;

  // 🔥 evita [object Object]
  if (typeof text === "string") {
    div.innerText = text;
  } else {
    div.innerText = JSON.stringify(text, null, 2);
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value;

  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  try {
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

    if (data.reply) {
      addMessage(data.reply, "bot");
    } else {
      addMessage("❌ " + data.error, "bot");
    }

  } catch (error) {
    addMessage("❌ Error de conexión", "bot");
  }
}
