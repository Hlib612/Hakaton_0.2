// === 1. Опис кадрів для кожного персонажа ===
import dudeWalk from '../img/dude_walk_animation.png';
import dudeIdle from '../img/dude.png';

import hogWalk from '../img/hog_rider_walk_animation.png';
import hogIdle from '../img/hog_rider.gif';

import amogusWalk from '../img/amogus_walk_animation.png';
import amogusIdle from '../img/amogus.png';

const characterFrames = {
  dude: [dudeWalk, dudeIdle],
  hog: [hogWalk, hogIdle],
  amogus: [amogusWalk, amogusIdle]
};

// === 2. Вибір персонажа ===
let selectedCharacter = null;
let selectedCharacterType = null;

document.querySelectorAll('.character-option').forEach(img => {
  img.addEventListener('click', function() {
    document.querySelectorAll('.character-option').forEach(i => i.classList.remove('selected'));
    this.classList.add('selected');
    selectedCharacter = this.getAttribute('data-character');
    // Визначаємо тип персонажа по data-character
    if (selectedCharacter.includes('dude')) selectedCharacterType = 'dude';
    else if (selectedCharacter.includes('hog')) selectedCharacterType = 'hog';
    else if (selectedCharacter.includes('amogus')) selectedCharacterType = 'amogus';
  });
});

// === 3. Додавання персонажа на поле ===
document.getElementById('add-character').addEventListener('click', function() {
  if (!selectedCharacter) {
    alert('Оберіть персонажа!');
    return;
  }

  const field = document.getElementById('room');

  // Видаляємо всіх старих персонажів
  field.querySelectorAll('.character').forEach(el => el.remove());

  const charImg = document.createElement('img');
  charImg.src = selectedCharacter;
  charImg.className = 'character';
  charImg.dataset.characterType = selectedCharacterType;
  charImg.style.position = 'absolute';
  field.appendChild(charImg);

  // Центруємо персонажа
  const centerX = (field.offsetWidth - charImg.offsetWidth) / 2;
  const centerY = (field.offsetHeight - charImg.offsetHeight) / 2;
  charImg.style.left = `${centerX}px`;
  charImg.style.top = `${centerY}px`;
});

// === 4. Анімація ходьби ===
function startWalkAnimation(characterImg, frames, frameDuration = 300) {
  let frame = 0;
  characterImg._walkAnimInterval = setInterval(() => {
    characterImg.src = frames[frame];
    frame = (frame + 1) % frames.length;
  }, frameDuration);
}

function stopWalkAnimation(characterImg, idleFrame) {
  if (characterImg._walkAnimInterval) {
    clearInterval(characterImg._walkAnimInterval);
    characterImg._walkAnimInterval = null;
  }
  characterImg.src = idleFrame;
}

// === 5. Плавний рух персонажа з анімацією ===
function moveCharacterSmoothly(character, targetX, targetY, frames, idleFrame, speed = 300) {
  startWalkAnimation(character, frames);

  const parent = character.parentElement;
  const startX = parseFloat(character.style.left) || 0;
  const startY = parseFloat(character.style.top) || 0;
  const dx = targetX - startX;
  const dy = targetY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const duration = distance / speed * 1000;

  let startTime = null;

  function animate(time) {
    if (!startTime) startTime = time;
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Обмежуємо координати на кожному кроці!
    let newLeft = startX + dx * progress;
    let newTop = startY + dy * progress;
    newLeft = Math.max(0, Math.min(newLeft, parent.offsetWidth - character.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, parent.offsetHeight - character.offsetHeight));

    character.style.left = newLeft + 'px';
    character.style.top = newTop + 'px';

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      stopWalkAnimation(character, idleFrame);
    }
  }

  requestAnimationFrame(animate);
}

// === 6. Клік по полю для переміщення персонажа ===
document.getElementById('room').addEventListener('click', function(e) {
  const field = this;
  const character = field.querySelector('.character:last-child');
  if (character) {
    const rect = field.getBoundingClientRect();
    let x = e.clientX - rect.left - character.offsetWidth / 2;
    let y = e.clientY - rect.top - character.offsetHeight / 2;

    // Обмежуємо координати, щоб персонаж не виходив за межі поля
    x = Math.max(0, Math.min(x, field.offsetWidth - character.offsetWidth));
    y = Math.max(0, Math.min(y, field.offsetHeight - character.offsetHeight));

    const characterType = character.dataset.characterType;
    const frames = characterFrames[characterType];
    const idleFrame = frames[1];
    moveCharacterSmoothly(character, x, y, frames, idleFrame, 200);
  }
});