const namespace = (function () {
  const labelOpeners = document.querySelectorAll(".label-container p");
  const storageName = "trello-func-";
  const storage = JSON.parse(localStorage.getItem(storageName));
  const lists = document.querySelectorAll(".list");
  const btnsConfirm = document.querySelectorAll(".btn-add");
  let draggedItem = null;
  let items;
  let labelOpen = function () {
    return labelOpeners.forEach((opener) =>
      opener.addEventListener("click", function () {
        this.parentElement.classList.toggle("active");
      })
    );
  };
  const buttonsToConfirmNewItems = function () {
    btnsConfirm.forEach((btn) =>
      btn.addEventListener("click", function () {
        const storage = JSON.parse(localStorage.getItem(storageName));
        const value = this.previousElementSibling.value;
        const listId =
          this.parentElement.parentElement.parentElement.dataset.id;
        itemId = storage.length + 1;
        const newItemInfo = { value, listId, itemId };
        storage.push(newItemInfo);
        localStorage.setItem(storageName, JSON.stringify(storage));
        const newItem = document.createElement("div");
        newItem.classList.add("item");
        newItem.textContent = value;
        newItem.setAttribute("draggable", true);
        newItem.dataset.id = itemId;
        newItem.ondragstart = function (e) {
          namespace.setDraggedItem(e.target);
          setTimeout(function () {
            e.target.style.display = "none";
          }, 0);
        };
        newItem.ondragend = function (e) {
          setTimeout(function () {
            e.target.style.display = "block";
            namespace.setDraggedItem(null);
          }, 0);
        };
        this.parentElement.parentElement.parentElement.children[1].appendChild(
          newItem
        );
        namespace.createItems();
        namespace.createDraggable();
        console.log("alo");
      })
    );
  };
  const createStorage = function () {
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
  };
  const createItems = function () {
    items = document.querySelectorAll(".item");
  };
  const getItems = function () {
    return items;
  };
  const getDraggedItem = function (value) {
    draggedItem = value;
  };
  const setDraggedItem = function (value) {
    draggedItem = value;
  };
  const createDraggable = function () {
    const items = this.getItems();
    const itemsList = document.querySelectorAll(".list");

    draggedItem = this.getDraggedItem();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      item.addEventListener("dragstart", function () {
        draggedItem = item;
        setTimeout(function () {
          item.style.display = "none";
        }, 0);
      });

      item.addEventListener("dragend", function () {
        draggedItem.style.display = "block";
        setTimeout(function () {
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
          const storage = JSON.parse(localStorage.getItem(storageName));
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
  };
  return {
    labelOpen,
    createStorage,
    createItems,
    createDraggable,
    getItems,
    getDraggedItem,
    setDraggedItem,
    buttonsToConfirmNewItems,
  };
})();

window.addEventListener("load", function () {
  namespace.labelOpen();
  namespace.buttonsToConfirmNewItems();
  namespace.createStorage();
  namespace.createItems();
  namespace.createDraggable();
});
