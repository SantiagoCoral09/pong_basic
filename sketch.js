// Variables del juego
let ancho = 1000;
let alto = 500;
let pelotaX, pelotaY; // Posición de la pelota
let velocidadPelotaX = 6;
let velocidadPelotaY = 6;
let diametroPelota = 20;

let raquetaJugadorY, raquetaComputadoraY; // Posiciones de las raquetas
let anchoRaqueta = 10;
let altoRaqueta = 80;
let velocidadRaquetaComputadora = 4;

let grosorMarco = 10; // Grosor de los marcos superior e inferior

// Variables de puntaje
let puntajeJugador = 0;
let puntajeComputadora = 0;

// Variables para las imágenes y sonidos
let fondo, barraJugador, barraComputadora, bola;
let sonidoRebote, sonidoGol;

// Variable para el ángulo de rotación de la pelota
let anguloRotacionPelota = 0;

// Variables para el estado del juego
let juegoIniciado = false;
let juegoPausado = false;

function preload() {
    fondo = loadImage('./Sprites/fondo1.png');
    barraJugador = loadImage('./Sprites/barra1.png');
    barraComputadora = loadImage('./Sprites/barra2.png');
    bola = loadImage('./Sprites/bola.png');
    sonidoRebote = loadSound('./bounce.wav');
    sonidoGol = loadSound('./jingle.wav');
}

function setup() {
    createCanvas(ancho, alto);
    pelotaX = width / 2;
    pelotaY = height / 2;
    raquetaJugadorY = height / 2 - altoRaqueta / 2;
    raquetaComputadoraY = height / 2 - altoRaqueta / 2;

    // Configurar los eventos de los botones
    document.getElementById("botonIniciar").addEventListener("click", iniciarJuego);
    document.getElementById("botonPausarReanudar").addEventListener("click", pausarReanudarJuego);
    document.getElementById("botonReiniciar").addEventListener("click", reiniciarJuego);

}

// Función para iniciar el juego
function iniciarJuego() {
    juegoIniciado = true;
    juegoPausado = false;
    document.getElementById("botonPausarReanudar").innerText = "Pausar";
}

// Función para pausar y reanudar el juego
function pausarReanudarJuego() {
    if (juegoIniciado) {
        juegoPausado = !juegoPausado;
        document.getElementById("botonPausarReanudar").innerText = juegoPausado ? "Reanudar" : "Pausar";
    }
}

// Función para reiniciar el juego
function reiniciarJuego() {
    juegoIniciado = false;
    juegoPausado = false;
    puntajeJugador = 0;
    puntajeComputadora = 0;
    reiniciarPelota();
    document.getElementById("botonPausarReanudar").innerText = "Pausar";
}

function draw() {
    // Dibujar el fondo
    image(fondo, 0, 0, ancho, alto);

    // Dibujar el marcador de puntaje
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(255);
    text(`${puntajeJugador} - ${puntajeComputadora}`, width / 2, 30);

    // Dibujar la pelota con rotación
    push(); // Guardar el estado de transformación actual
    translate(pelotaX, pelotaY); // Mover el origen al centro de la pelota
    rotate(anguloRotacionPelota); // Rotar la pelota
    imageMode(CENTER); // Centrar la imagen
    image(bola, 0, 0, diametroPelota, diametroPelota);
    pop(); // Restaurar el estado de transformación

    // Dibujar las raquetas con imágenes
    image(barraJugador, 10, raquetaJugadorY, anchoRaqueta, altoRaqueta);
    image(barraComputadora, width - 20, raquetaComputadoraY, anchoRaqueta, altoRaqueta);

    // Detener el avance del juego si no ha iniciado o está pausado
    if (!juegoIniciado || juegoPausado) return;

    // Incrementar el ángulo de rotación basado en la velocidad de la pelota
    anguloRotacionPelota += sqrt(velocidadPelotaX ** 2 + velocidadPelotaY ** 2) * 0.05;

    // Movimiento de la pelota
    pelotaX += velocidadPelotaX;
    pelotaY += velocidadPelotaY;

    // Rebote de la pelota en los marcos superior e inferior
    if (
        pelotaY - diametroPelota / 2 <= grosorMarco ||
        pelotaY + diametroPelota / 2 >= height - grosorMarco
    ) {
        velocidadPelotaY *= -1;
    }


    // Movimiento de la raqueta del jugador
    if (keyIsDown(UP_ARROW)) {
        raquetaJugadorY -= 5;
    }
    if (keyIsDown(DOWN_ARROW)) {
        raquetaJugadorY += 5;
    }

    // Limitar el movimiento de la raqueta del jugador a los límites de los marcos
    raquetaJugadorY = constrain(
        raquetaJugadorY,
        grosorMarco,
        height - grosorMarco - altoRaqueta
    );

    // Movimiento de la raqueta de la computadora
    if (pelotaY < raquetaComputadoraY + altoRaqueta / 2) {
        raquetaComputadoraY -= velocidadRaquetaComputadora;
    } else if (pelotaY > raquetaComputadoraY + altoRaqueta / 2) {
        raquetaComputadoraY += velocidadRaquetaComputadora;
    }

    // Limitar el movimiento de la raqueta de la computadora a los límites de los marcos
    raquetaComputadoraY = constrain(
        raquetaComputadoraY,
        grosorMarco,
        height - grosorMarco - altoRaqueta
    );

    // Rebote de la pelota en las raquetas con ajuste de ángulo
    if (
        pelotaX - diametroPelota / 2 < 20 + anchoRaqueta &&
        pelotaY > raquetaJugadorY &&
        pelotaY < raquetaJugadorY + altoRaqueta
    ) {
        ajustarAnguloRebote(raquetaJugadorY);
        velocidadPelotaX *= -1;
        sonidoRebote.play(); // Reproducir sonido de rebote
    }

    if (
        pelotaX + diametroPelota / 2 > width - 30 &&
        pelotaY > raquetaComputadoraY &&
        pelotaY < raquetaComputadoraY + altoRaqueta
    ) {
        ajustarAnguloRebote(raquetaComputadoraY);
        velocidadPelotaX *= -1;
        sonidoRebote.play(); // Reproducir sonido de rebote
    }

    // Detectar cuando la pelota sale del campo y actualizar el puntaje
    // if (pelotaX < 0) {
    //     puntajeComputadora++;
    //     sonidoGol.play(); // Reproducir sonido de gol
    //     reiniciarPelota();
    // } else if (pelotaX > width) {
    //     puntajeJugador++;
    //     sonidoGol.play(); // Reproducir sonido de gol
    //     reiniciarPelota();
    // }

    // Detectar cuando la pelota sale del campo y actualizar el puntaje
    if (pelotaX < 0) {
        puntajeComputadora++;
        sonidoGol.play();
        anunciarMarcador();
        reiniciarPelota();
    } else if (pelotaX > width) {
        puntajeJugador++;
        sonidoGol.play();
        anunciarMarcador();
        reiniciarPelota();
    }



}

// Función para ajustar el ángulo de rebote en función del punto de colisión en la raqueta
function ajustarAnguloRebote(raquetaY) {
    let puntoImpacto = pelotaY - raquetaY;
    let posicionRelativa = (puntoImpacto - altoRaqueta / 2) / (altoRaqueta / 2);

    // Calcular el ángulo en radianes según el punto de colisión en la raqueta
    let anguloRebote = (posicionRelativa * PI) / 4; // Ángulo máximo de desviación de 45 grados (π/4)

    // Actualizar velocidades de la pelota usando el coseno y el seno del ángulo
    let velocidad = sqrt(
        velocidadPelotaX * velocidadPelotaX + velocidadPelotaY * velocidadPelotaY
    );
    velocidadPelotaX = velocidad * cos(anguloRebote) * (velocidadPelotaX > 0 ? 1 : -1);
    velocidadPelotaY = velocidad * sin(anguloRebote);
}

// Función para reiniciar la posición de la pelota al centro
function reiniciarPelota() {
    pelotaX = width / 2;
    pelotaY = height / 2;
    // Invertir dirección de la pelota aleatoriamente para variar el inicio
    velocidadPelotaX = 6 * (random() > 0.5 ? 1 : -1);
    velocidadPelotaY = 6 * (random() > 0.5 ? 1 : -1);
}

// Función para anunciar el puntaje con el narrador
function anunciarMarcador() {
    let mensaje = `Punto. ${puntajeJugador}, ${puntajeComputadora}.`;
    let narrador = new SpeechSynthesisUtterance(mensaje);
    narrador.lang = 'es-LA'; // Configura el idioma a español
    window.speechSynthesis.speak(narrador);
}