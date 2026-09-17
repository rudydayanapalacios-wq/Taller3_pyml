const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

const startButton = document.getElementById("startButton");
const status = document.getElementById("status");
const faceCount = document.getElementById("faceCount");

const cameraPlaceholder =
    document.querySelector(".camera-placeholder");

const navItems =
    document.querySelectorAll(".nav-item");

const sections =
    document.querySelectorAll(".page-section");

const goDetectionButton =
    document.getElementById("goDetectionButton");

const openDetectionButton =
    document.getElementById("openDetectionButton");


let cameraStarted = false;
let detecting = false;
let stream = null;

const API_URL = "http://127.0.0.1:8000";


// ============================================
// MENÚ
// ============================================

function showSection(sectionId) {

    sections.forEach(section => {
        section.classList.remove("active-section");
    });

    const section =
        document.getElementById(sectionId);

    if (section) {
        section.classList.add("active-section");
    }

    navItems.forEach(item => {

        item.classList.remove("active");

        if (item.dataset.section === sectionId) {
            item.classList.add("active");
        }

    });
}


navItems.forEach(item => {

    item.addEventListener("click", () => {

        showSection(
            item.dataset.section
        );

    });

});


if (goDetectionButton) {

    goDetectionButton.addEventListener(
        "click",
        () => showSection("detectionSection")
    );

}


if (openDetectionButton) {

    openDetectionButton.addEventListener(
        "click",
        () => showSection("detectionSection")
    );

}


// ============================================
// CÁMARA
// ============================================

async function startCamera() {

    if (cameraStarted) {
        return;
    }

    try {

        stream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: "user"
                },

                audio: false

            });


        video.srcObject = stream;

        cameraStarted = true;


        if (cameraPlaceholder) {
            cameraPlaceholder.style.display = "none";
        }


        status.textContent =
            "Camera active · Detecting faces";


        startButton.textContent =
            "CAMERA ACTIVE";

        startButton.disabled = true;


        await video.play();


        detectFaces();


    } catch (error) {

        console.error(
            "Error accediendo a la cámara:",
            error
        );

        status.textContent =
            "Camera access denied or unavailable";

    }

}


// ============================================
// DETECCIÓN
// ============================================

async function detectFaces() {

    if (!cameraStarted) {
        return;
    }


    if (detecting) {
        requestAnimationFrame(detectFaces);
        return;
    }


    if (
        video.videoWidth === 0 ||
        video.videoHeight === 0
    ) {

        requestAnimationFrame(detectFaces);

        return;
    }


    detecting = true;


    try {

        // ------------------------------------
        // Usar el tamaño REAL de la cámara
        // ------------------------------------

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;


        const context =
            canvas.getContext("2d");


        // ------------------------------------
        // Capturar fotograma
        // ------------------------------------

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        // ------------------------------------
        // Convertir a imagen
        // ------------------------------------

        const blob =
            await new Promise(resolve => {

                canvas.toBlob(
                    resolve,
                    "image/jpeg",
                    0.85
                );

            });


        if (!blob) {
            return;
        }


        // ------------------------------------
        // Enviar a FastAPI
        // ------------------------------------

        const formData =
            new FormData();

        formData.append(
            "file",
            blob,
            "camera.jpg"
        );


        const response =
            await fetch(
                `${API_URL}/detect`,
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        // ------------------------------------
        // Limpiar canvas
        // ------------------------------------

        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // ------------------------------------
        // DIBUJAR RECTÁNGULOS
        // ------------------------------------

        if (
            data.success &&
            data.faces
        ) {

            faceCount.textContent =
                data.faces.length;


            data.faces.forEach(face => {

                context.strokeStyle =
                    "#b83d5b";

                context.lineWidth = 5;


                context.strokeRect(

                    face.x,
                    face.y,
                    face.width,
                    face.height

                );

            });


            if (data.faces.length > 0) {

                status.textContent =
                    "Camera active · Face detected";

            } else {

                status.textContent =
                    "Camera active · No face detected";

            }

        }


    } catch (error) {

        console.error(
            "Error conectando con OpenCV:",
            error
        );

        status.textContent =
            "Detection server unavailable";

    } finally {

        detecting = false;

        setTimeout(
            () => requestAnimationFrame(detectFaces),
            100
        );

    }

}


// ============================================
// BOTÓN
// ============================================

if (startButton) {

    startButton.addEventListener(
        "click",
        startCamera
    );

}