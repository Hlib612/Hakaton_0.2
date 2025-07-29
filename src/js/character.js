const characterFrames = {
  dude: [
    '../img/dude_walk_animation.png', // кадр ходьби
    '../img/dude.png'                 // стоячий кадр
  ],
  hog: [
    '../img/hog_rider_walk_animation.png',      // кадр ходьби
    '../img/hog_rider.gif'            // стоячий кадр
  ],
    amogus: [
    '../img/amogus_walk_animation.png', // кадр ходьби
    '../img/amogus.png'       // стоячий кадр
  ]
};

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

function moveCharacterSmoothly(character, targetX, targetY, frames, idleFrame, speed = 300) {
  // Запускаємо анімацію ходьби
  startWalkAnimation(character, frames);

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

    character.style.left = startX + dx * progress + 'px';
    character.style.top = startY + dy * progress + 'px';

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Зупиняємо анімацію ходьби, коли рух завершено
      stopWalkAnimation(character, idleFrame);
    }
  }

  requestAnimationFrame(animate);
}

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
  charImg.dataset.characterType = selectedCharacterType; // якщо використовуєш тип
  charImg.style.left = '0px';
  charImg.style.top = '0px';
  field.appendChild(charImg);
});

function animateWalk(characterImg, frames, duration = 400, idleFrame = null) {
  let frame = 0;
  const frameCount = frames.length;
  const interval = duration / frameCount;
  const anim = setInterval(() => {
    characterImg.src = frames[frame];
    frame++;
    if (frame >= frameCount) {
      clearInterval(anim);
      // Повертаємо початковий кадр (idleFrame) після анімації
      if (idleFrame) {
        characterImg.src = idleFrame;
      }
    }
  }, interval);
}

document.getElementById('room').addEventListener('click', function(e) {
  const character = this.querySelector('.character:last-child');
  if (character) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - character.offsetWidth / 2;
    const y = e.clientY - rect.top - character.offsetHeight / 2;
    // Визначаємо тип персонажа і його кадри
    const characterType = character.dataset.characterType;
const frames = characterFrames[characterType];
const idleFrame = frames[1]; // стоячий кадр

moveCharacterSmoothly(character, x, y, frames, idleFrame, 200);
  }
});