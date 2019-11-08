import "./index.scss";
import { ipcRenderer } from "electron";

function addText(text: string) {
  const el = document.createElement("div");
  el.classList.add("text");
  el.innerText = text;
  const container = document.querySelector("#container")!;
  container.appendChild(el);
  container.scrollTo(0, container.scrollHeight);
}

document
  .querySelector("#app")!
  .insertAdjacentHTML(
    "afterbegin",
    `<div id="container"><div style="height: 100%">&nbsp;</div></div>`
  );

ipcRenderer.on("NEW_TEXT", (ev, data) => {
  addText(data);
});
