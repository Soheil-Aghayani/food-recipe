function post(msg){
  window.parent.postMessage(msg, "*");
}

function getParam(name){
  const u = new URL(window.location.href);
  return u.searchParams.get(name) || "";
}

function renderResults(q){
  const r = document.getElementById("results");
  r.style.display = "block";
  r.innerHTML = "";

  const items = [
    {
      url: "soheil-os.local",
      title: "Soheil OS",
      desc: "محیطی شبیه macOS برای نمایش دستور پخت ها",
      action: () => post({ type: "os:openApp", app: "finder", view: "projects" })
    },
    {
      url: "recipes.local",
      title: "Projects",
      desc: "لیست دستور پخت ها از recipes.json",
      action: () => post({ type: "os:openApp", app: "finder", view: "projects" })
    },
    {
      url: "igithub.local",
      title: "iGithub",
      desc: "لیست ریپوها به صورت دینامیک",
      action: () => post({ type: "os:openApp", app: "igithub" })
    },
    {
      url: "music.local",
      title: "Music",
      desc: "پخش آهنگ داخل OS",
      action: () => post({ type: "os:openApp", app: "music" })
    }
  ];

  items.forEach((it) => {
    const row = document.createElement("div");
    row.className = "result";
    row.innerHTML = '<div class="url">' + it.url + '</div>' +
                    '<button class="title" type="button">' + it.title + '</button>' +
                    '<div class="desc">' + it.desc + '</div>';
    row.querySelector(".title").addEventListener("click", it.action);
    r.appendChild(row);
  });
}

const qInput = document.getElementById("q");
const qValue = getParam("q");
qInput.value = qValue;

if (qValue.trim()) renderResults(qValue.trim());

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = qInput.value.trim();
  const u = new URL(window.location.href);
  u.searchParams.set("q", q);
  window.location.href = u.toString();
});

document.getElementById("lucky").addEventListener("click", () => {
  post({ type: "os:openApp", app: "finder", view: "projects" });
});

document.getElementById("goStart").addEventListener("click", () => {
  post({ type: "safari:navigate", url: "start" });
});

document.getElementById("goProjects").addEventListener("click", () => {
  post({ type: "os:openApp", app: "finder", view: "projects" });
});

document.getElementById("goIGithub").addEventListener("click", () => {
  post({ type: "os:openApp", app: "igithub" });
});

document.getElementById("goMusic").addEventListener("click", () => {
  post({ type: "os:openApp", app: "music" });
});
