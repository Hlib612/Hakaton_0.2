const catalogItems = [
  { type: "furniture", price: 499, name: "Ліжко", image: "../img/forniture/bed-pixel.png" },
  { type: "furniture", price: 70, name: "Стіл", image: "../img/forniture/table-pixel.png" },
  { type: "tech", price: 1299, name: "Комп'ютер", image: "../img/forniture/pixel-computer.png" },
  { type: "decor", price: 40, name: "Квітка", image: "../img/forniture/pixel-flower-pot.png" },
  { type: "decor", price: 259, name: "Кулер", image: "../img/forniture/pixel-cooler.png" },
  { type: "tech", price: 759, name: "Телевізор", image: "../img/forniture/pixel-tv.png" },
  { type: "furniture", price: 200, name: "Ігрове крісло", image: "../img/forniture/pixel-gamechair.png" }
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
const tipsContainer = document.getElementById('tipsContainer');
const tips = [
  document.getElementById('tip1'),
  document.getElementById('tip2'),
  document.getElementById('tip3')
];
const nextBtn = document.getElementById('nextTip');
const trueBtn = document.getElementById('trueBtn');
const falseBtn = document.getElementById('falseBtn');

let currentTipIndex = 0;

// Показать конкретный совет
function showTip(index) {
  tips.forEach((tip, i) => {
    tip.classList.toggle('active', i === index);
  });
  tipsContainer.style.display = 'block';
}

// Скрыть все подсказки
function hideTips() {
  tipsContainer.style.display = 'none';
}

// Показать модалку "Вы были тут?"
function showTutorialModal() {
  backdrop.style.display = 'block';
  tutorialModal.style.display = 'flex';
}

// Скрыть модалку
function hideTutorialModal() {
  backdrop.style.display = 'none';
  tutorialModal.style.display = 'none';
}

// Запуск показа подсказок
function startTipsTutorial() {
  currentTipIndex = 0;
  hideTutorialModal();
  showTip(currentTipIndex);
}

// Обработка событий после загрузки
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

// Рендер товаров
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

// Изменение цвета стен
colorPicker.addEventListener("input", (event) => {
  walls.forEach((wall) => {
    wall.style.backgroundColor = event.target.value;
  });
});

// Генерация сетки
for (let i = 0; i < 36; i++) {
  const cell = document.createElement('div');
  cell.className = 'grid-cell';

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

// Сортировка по категориям
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

