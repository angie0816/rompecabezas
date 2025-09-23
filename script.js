const tablero = document.getElementById("tablero");
const mensaje = document.getElementById("mensaje");

// Generar posiciones aleatorias dentro del tablero
function getRandomPosition() {
  const x = Math.floor(Math.random() * (tablero.clientWidth - 100));
  const y = Math.floor(Math.random() * (tablero.clientHeight - 100));
  return { x, y };
}

// Crear fichas
const fichas = [];
for (let i = 1; i <= 9; i++) {
  const ficha = document.createElement("div");
  ficha.className = "ficha";
  ficha.textContent = i;
  ficha.dataset.valor = i;

  const pos = getRandomPosition();
  ficha.style.left = pos.x + "px";
  ficha.style.top = pos.y + "px";

  tablero.appendChild(ficha);
  fichas.push(ficha);
}

// Lógica de arrastrar
let fichaActiva = null;
let offsetX, offsetY;

fichas.forEach(ficha => {
  ficha.addEventListener("mousedown", e => {
    fichaActiva = ficha;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    ficha.style.zIndex = 1000;
  });

  document.addEventListener("mousemove", e => {
    if (fichaActiva) {
      fichaActiva.style.left = (e.pageX - tablero.offsetLeft - offsetX) + "px";
      fichaActiva.style.top = (e.pageY - tablero.offsetTop - offsetY) + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    if (fichaActiva) {
      snapToGrid(fichaActiva);
      fichaActiva.style.zIndex = "";
      fichaActiva = null;
      verificarOrden();
    }
  });
});

// Posicionar en la cuadrícula más cercana
function snapToGrid(ficha) {
  const x = parseInt(ficha.style.left);
  const y = parseInt(ficha.style.top);

  const col = Math.round(x / 104); // 100px + 4px de margen
  const row = Math.round(y / 104);

  const nuevoX = col * 104;
  const nuevoY = row * 104;

  ficha.style.left = nuevoX + "px";
  ficha.style.top = nuevoY + "px";
}

// Verificar si están en el orden correcto
function verificarOrden() {
  const ordenCorrecto = [];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const x = col * 104;
      const y = row * 104;

      const ficha = fichas.find(f => 
        parseInt(f.style.left) === x &&
        parseInt(f.style.top) === y
      );

      if (ficha) {
        ordenCorrecto.push(parseInt(ficha.dataset.valor));
      } else {
        ordenCorrecto.push(null); // espacio vacío (no debería ocurrir)
      }
    }
  }

  // Comparar con el orden correcto
  const esCorrecto = ordenCorrecto.every((val, idx) => val === idx + 1);
  if (esCorrecto) {
    mensaje.style.display = "block";
    fichas.forEach(f => f.classList.add("correcto"));
  } else {
    mensaje.style.display = "none";
    fichas.forEach(f => f.classList.remove("correcto"));
  }
}