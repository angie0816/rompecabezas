const tablero = document.getElementById("tablero");
const mensaje = document.getElementById("mensaje");
const imagenEstado = document.getElementById("imagen-estado");

// Lista de imágenes (una para cada ficha del rompecabezas)
const logo = [
  "logo/logo1.jpeg", "logo/logo2.jpeg", "logo/logo3.jpeg",
  "logo/logo4.jpeg", "logo/logo5.jpeg", "logo/logo6.jpeg",
  "logo/logo7.jpeg", "logo/logo8.jpeg", "logo/logo9.jpeg"
];

// Imágenes que se alternan mientras el puzzle no está resuelto
const imagenesAlternar = ["imagenesjd/jd1.png", "imagenesjd/jd2.png"];
let indiceAlternar = 0;
let intervaloAlternar;

// Función para iniciar el parpadeo de imágenes
function iniciarAlternar() {
  intervaloAlternar = setInterval(() => {
    indiceAlternar = (indiceAlternar + 1) % imagenesAlternar.length;
    imagenEstado.src = imagenesAlternar[indiceAlternar];
  }, 1000); // cambia cada 1 segundo
}

// Función para detener la animación y mostrar la imagen final
function mostrarCompleto() {
  clearInterval(intervaloAlternar);
  imagenEstado.src = "imagenesjd/jdcompleto.png"; // imagen final cuando se completa
}

// Crear fichas
const fichas = [];
for (let i = 0; i < 9; i++) {
  const ficha = document.createElement("div");
  ficha.className = "ficha";
  ficha.dataset.valor = i + 1;
  ficha.style.backgroundImage = `url(${logo[i]})`;

  // Posición inicial aleatoria dentro del tablero
  const maxX = 312 - 100;
  const maxY = 312 - 100;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  ficha.style.left = randomX + "px";
  ficha.style.top = randomY + "px";

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

// Ajustar a la cuadrícula más cercana
function snapToGrid(ficha) {
  const x = parseInt(ficha.style.left);
  const y = parseInt(ficha.style.top);

  const col = Math.round(x / 104);
  const row = Math.round(y / 104);

  ficha.style.left = (col * 104) + "px";
  ficha.style.top = (row * 104) + "px";
}

// Verificar si el puzzle está correcto
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
        ordenCorrecto.push(null);
      }
    }
  }

  const esCorrecto = ordenCorrecto.every((val, idx) => val === idx + 1);
  if (esCorrecto) {
    mensaje.style.display = "block";
    document.getElementById("inicio").textContent =
      "¡Gracias por ayudarme a completar el Rompecabezas!";
    fichas.forEach(f => f.classList.add("correcto"));
    mostrarCompleto(); // ✅ detiene el alternar y muestra la final
  } else {
    mensaje.style.display = "none";
    fichas.forEach(f => f.classList.remove("correcto"));
  }
}

// Iniciar alternancia de imágenes al cargar la página
iniciarAlternar();


