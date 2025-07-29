// === Імпорти меблів ===
import bed from "../img/forniture/bed-pixel.png";
import table from "../img/forniture/table-pixel.png";
import gameChair from "../img/forniture/pixel-gamechair.png";
import wardrobe from "../img/forniture/tallWardrobe.png";
import bookshelf from "../img/forniture/books-pixel.png";
import nightstand from "../img/forniture/pixel-nightstand.png";


import computer from "../img/forniture/pixel-computer.png";
import tv from "../img/forniture/pixel-tv.png";
import boombox from "../img/forniture/boombox.png";


import flowerPot from "../img/forniture/pixel-flower-pot.png";
import cooler from "../img/forniture/pixel-cooler.png";
import plant from "../img/forniture/plant.png";

import bgImage from "./../img/parquet.png";

const catalogItems = [
  { type: "furniture", price: 499, name: "Ліжко", image: bed },
  { type: "furniture", price: 70, name: "Стіл", image: table },
  { type: "tech", price: 1299, name: "Комп'ютер", image: computer },
  { type: "decor", price: 40, name: "Квітка", image: flowerPot },
  { type: "decor", price: 259, name: "Кулер", image: cooler },
  { type: "tech", price: 759, name: "Телевізор", image: tv },
  { type: "furniture", price: 200, name: "Ігрове крісло", image: gameChair },
  { type: "tech", price: 150, name: "Бумбокс", image: boombox },
  { type: "decor", price: 99, name: "Рослина", image: plant },
  { type: "furniture", price: 199, name: "Шафа", image: wardrobe },
  { type: "furniture", price: 99, name: "Книжна Шафа", image: bookshelf },
  { type: "furniture", price: 99, name: "Тумба", image: nightstand }
];

const selected = { item: null };

const itemsContainer = document.querySelector('.items');
const scrollWrapper = document.querySelector('.catalog-scroll');
const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');
const grid = document.querySelector('.grid');
const colorPicker = document.querySelector('#wallColor');
const walls = document.querySelectorAll('.wall');

const backdrop = document.querySelector('.backdrop');
const tutorialModal = document.querySelector('.tutorial');
const tipsContainer = document.querySelector('#tipsContainer');
const tips = [
  document.querySelector('#tip1'),
  document.querySelector('#tip2'),
  document.querySelector('#tip3'),
  document.querySelector('#tip4')
];
const nextBtn = document.querySelector('#nextTip');
const trueBtn = document.querySelector('#trueBtn');
const falseBtn = document.querySelector('#falseBtn');

let currentTipIndex = 0;

function showTip(index) {
  tips.forEach((tip, i) => {
    tip.classList.toggle('active', i === index);
  });
  tipsContainer.style.display = 'block';
}

function hideTips() {
  tipsContainer.style.display = 'none';
}

function showTutorialModal() {
  backdrop.style.display = 'block';
  tutorialModal.style.display = 'flex';
}

function hideTutorialModal() {
  backdrop.style.display = 'none';
  tutorialModal.style.display = 'none';
}

function startTipsTutorial() {
  currentTipIndex = 0;
  hideTutorialModal();
  showTip(currentTipIndex);
}

window.onload = () => {
  if (!localStorage.getItem('visited')) {
    showTutorialModal();
  }

  trueBtn.addEventListener('click', () => {
    hideTutorialModal();
    localStorage.setItem('visited', 'true');
  });

  falseBtn.addEventListener('click', () => {
    startTipsTutorial();
  });

  nextBtn.addEventListener('click', () => {
    currentTipIndex++;
    if (currentTipIndex >= tips.length) {
      hideTips();
      localStorage.setItem('visited', 'true');
    } else {
      showTip(currentTipIndex);
    }
  });
};

function filterItems(category) {
  if (category === 'all') {
    return catalogItems;
  }
  return catalogItems.filter(item => item.type === category);
}

function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function renderCatalogItems(items) {
  clearContainer(itemsContainer);
  items.forEach(item => {
    const article = document.createElement("article");
    article.className = "catalog-entry";

    const img = document.createElement('img');
    img.className = 'catalog-item';
    img.src = item.image;
    img.alt = item.name;
    img.width = 60;
    img.height = 60;
    img.title = item.name;
    img.draggable = true;

    img.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', item.image);
    });

    img.addEventListener('click', () => {
      document.querySelectorAll('.catalog-item').forEach(el => el.classList.remove('selected'));
      img.classList.add('selected');
      selected.item = item;
    });

    const label = document.createElement("div");
    label.className = "item-label";
    label.innerHTML = `<div><h3 class="catalog-categories-article-title">${item.name}</h3></div><div><p class="item-price">${item.price}$</p></div>`;

    article.appendChild(img);
    article.appendChild(label);
    itemsContainer.appendChild(article);
  });
}

renderCatalogItems(catalogItems);

colorPicker.addEventListener("input", (event) => {
  walls.forEach((wall) => {
    wall.style.backgroundColor = event.target.value;
  });
});

for (let i = 0; i < 36; i++) {
  const cell = document.createElement('div');
  cell.className = 'grid-cell';
  cell.style.backgroundImage = `url('${bgImage}')`

  cell.addEventListener('click', () => {
    if (selected.item) {
      const furniture = document.createElement('div');
      furniture.className = 'furniture';
      furniture.style.backgroundImage = `url(${selected.item.image})`;
      cell.innerHTML = '';
      cell.appendChild(furniture);
    }
  });

  cell.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  cell.addEventListener('drop', (e) => {
    e.preventDefault();
    const imageURL = e.dataTransfer.getData('text/plain');
    const furniture = document.createElement('div');
    furniture.className = 'furniture';
    furniture.style.backgroundImage = `url(${imageURL})`;
    cell.innerHTML = '';
    cell.appendChild(furniture);

    furniture.addEventListener('dblclick', () => {
      furniture.remove();
    });
  });

  grid.appendChild(cell);
}

document.querySelector('#save-btn').addEventListener('click', () => {
  alert('Збереження ще в розробці!');
});

const categoryButtons = document.querySelectorAll('.catalog-categories button');

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    categoryButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const category = button.dataset.category;
    const filteredItems = filterItems(category);
    renderCatalogItems(filteredItems);
  });
});

