import "./app.scss";
import content from "./app.html";
import { ipcRenderer } from "electron";

import { EVENT_CLEAR, EVENT_NEW_TEXT } from "../common/events";

function addText(text: string) {
  const el = document.createElement("div");
  el.classList.add("text");
  el.innerText = text;

  const container = document.querySelector("#container")!;
  container.appendChild(el);
  container.scrollTo(0, container.scrollHeight);
}

function clearTexts() {
  const container = document.querySelector("#container")!;
  const texts = container.querySelectorAll(".text");
  for (const text of texts) {
    container.removeChild(text);
  }
}

document.querySelector("#app")!.insertAdjacentHTML("afterbegin", content);

ipcRenderer.on(EVENT_NEW_TEXT, (ev, data) => {
  addText(data);
});

ipcRenderer.on(EVENT_CLEAR, (ev, data) => {
  clearTexts();
});
