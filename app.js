const chat = document.getElementById("chat");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
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

  addMessage(data.reply, "bot");
}