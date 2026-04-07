const chat = document.getElementById("chat");

function addMessage(text, sender) {
  const div = document.createElement("div");

  div.style.margin = "10px";
  div.style.padding = "10px";
  div.style.borderRadius = "10px";
  div.style.maxWidth = "80%";

  if (sender === "user") {
    div.style.background = "#2563eb";
    div.style.marginLeft = "auto";
  } else {
    div.style.background = "#16a34a";
    div.style.marginRight = "auto";
  }

  div.innerText = text;

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
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    const data = await res.json();

    console.log("Respuesta IA:", data); // 👈 CLAVE PARA DEBUG

    if (data.reply) {
      addMessage(data.reply, "bot");
    } else {
      addMessage("❌ Error: " + JSON.stringify(data), "bot");
    }

  } catch (error) {
    console.error(error);
    addMessage("❌ Error de conexión", "bot");
  }
}
