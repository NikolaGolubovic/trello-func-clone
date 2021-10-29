const labelOpeners = document.querySelectorAll(".label-container p");
const storageName = "trello-func-";

const storage = JSON.parse(localStorage.getItem(storageName));
const lists = document.querySelectorAll(".list");

if (!storage) {
  localStorage.setItem(storageName, JSON.stringify([]));
} else {
  storage.forEach((elem) => {
    const newItem = document.createElement("div");
    newItem.classList.add("item");
    newItem.textContent = elem.value;
    newItem.setAttribute("draggable", true);
    newItem.dataset.id = elem.itemId;
    lists.forEach((list) => {
      if (list.dataset.id === elem.listId) {
        list.children[1].appendChild(newItem);
      }
    });
  });
}

labelOpeners.forEach((opener) =>
  opener.addEventListener("click", function () {
    this.parentElement.classList.toggle("active");
  })
);

const btnsConfirm = document.querySelectorAll(".btn-add");

btnsConfirm.forEach((btn) =>
  btn.addEventListener("click", function () {
    const storage = JSON.parse(localStorage.getItem(storageName));
    const value = this.previousElementSibling.value;
    const listId = this.parentElement.parentElement.parentElement.dataset.id;
    itemId = storage.length + 1;
    const newItemInfo = { value, listId, itemId };
    storage.push(newItemInfo);
    localStorage.setItem(storageName, JSON.stringify(storage));
    const newItem = document.createElement("div");
    newItem.classList.add("item");
    newItem.textContent = value;
    newItem.setAttribute("draggable", true);
    newItem.dataset.id = itemId;
    this.parentElement.parentElement.parentElement.children[1].appendChild(
      newItem
    );
    // cheat, na lokalnom serveru radi u tren oka, ne mogu da se izborim sa refresom querySelectora u global scopu
    // u reactu bi to islo mnogo lakse sa state update
    // pa se nadam da ce biti oprosten :)
    location.reload();
  })
);

const items = document.querySelectorAll(".item");
const itemsList = document.querySelectorAll(".list");

let draggedItem = null;

for (let i = 0; i < items.length; i++) {
  const item = items[i];

  item.addEventListener("dragstart", function () {
    draggedItem = item;
    setTimeout(function () {
      item.style.display = "none";
    }, 0);
  });

  item.addEventListener("dragend", function () {
    setTimeout(function () {
      draggedItem.style.display = "block";
      draggedItem = null;
    }, 0);
  });

  for (let j = 0; j < itemsList.length; j++) {
    const list = itemsList[j];

    list.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    list.addEventListener("dragenter", function (e) {
      e.preventDefault();
      this.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    });

    list.addEventListener("dragleave", function (e) {
      this.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    });

    list.addEventListener("drop", function (e) {
      this.children[1].append(draggedItem);
      const newElem = {
        value: draggedItem.textContent,
        listId: this.dataset.id,
        itemId: draggedItem.dataset.id,
      };
      const newStorage = storage.filter((elem) => {
        return elem.itemId != draggedItem.dataset.id;
      });
      newStorage.push(newElem);
      localStorage.setItem(storageName, JSON.stringify(newStorage));
      this.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    });
  }
}
