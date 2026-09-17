// ==========================================
// 1. REFERENCIAS A ELEMENTOS COMUNES
// ==========================================

const loader = document.getElementById("loader");

const imgResult = document.getElementById("imgResult");
const uploadResult = document.getElementById("uploadResult");

const metricsZone = document.getElementById("metricsZone");
const faceCount = document.getElementById("faceCount");
const metricsFaceCount = document.getElementById("metricsFaceCount");

// ==========================================
// 2. REFERENCIAS MODO ARCHIVO (UPLOAD)
// ==========================================

const sectionUpload = document.getElementById("sectionUpload");
const btnModeUpload = document.getElementById("btnModeUpload");
const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const btnProcess = document.getElementById("btnProcess");
const imgOriginal = document.getElementById("imgOriginal");
const boxOriginal = document.getElementById("boxOriginal");

// ==========================================
// 3. REFERENCIAS MODO CÁMARA (WEBCAM)
// ==========================================

const sectionCamera = document.getElementById("sectionCamera");
const btnModeCamera = document.getElementById("btnModeCamera");
const video = document.getElementById("webcam");
const canvas = document.getElementById("canvasFrame");

const btnStartCamera = document.getElementById("btnStartCamera");
const btnStopCamera = document.getElementById("btnStopCamera");
const btnToggleCamera = document.getElementById("btnToggleCamera");

// ==========================================
// 4. VARIABLES DE ESTADO
// ==========================================

let selectedFile = null;

let streamInstance = null;
let streamInterval = null;

let isStreaming = false;

let currentFacingMode = "user";

// ==========================================
// 5. CONTROL DE INTERFAZ
// ==========================================

btnModeUpload.addEventListener("click", () => {
    switchMode("upload");
});

btnModeCamera.addEventListener("click", () => {
    switchMode("camera");
});

function switchMode(mode) {

    if (mode === "upload") {

        btnModeUpload.classList.add("active");
        btnModeCamera.classList.remove("active");

        sectionUpload.classList.remove("d-none");
        sectionCamera.classList.add("d-none");

        boxOriginal.classList.remove("d-none");

        stopCameraFlow();

    } else {

        btnModeCamera.classList.add("active");
        btnModeUpload.classList.remove("active");

        sectionCamera.classList.remove("d-none");
        sectionUpload.classList.add("d-none");

        boxOriginal.classList.add("d-none");

        imgResult.classList.add("d-none");
        metricsZone.classList.add("d-none");
    }
}

// ==========================================
// 6. DASHBOARD
// ==========================================

const dashboardButton = document.querySelector(
    ".nav-item.active"
);

if (dashboardButton) {

    dashboardButton.addEventListener("click", () => {
        window.location.href = "/";
    });

}

// ==========================================
// 7. LÓGICA MODO ARCHIVO
// ==========================================

["dragenter", "dragover"].forEach((name) => {

    dropZone.addEventListener(name, (e) => {

        e.preventDefault();

        dropZone.classList.add(
            "bg-primary",
            "bg-opacity-10"
        );

    });

});

["dragleave", "drop"].forEach((name) => {

    dropZone.addEventListener(name, (e) => {

        e.preventDefault();

        dropZone.classList.remove(
            "bg-primary",
            "bg-opacity-10"
        );

    });

});

// ==========================================
// DRAG & DROP
// ==========================================

dropZone.addEventListener("drop", (e) => {

    const file = e.dataTransfer.files[0];

    handleFile(file);

});

// ==========================================
// SELECCIONAR ARCHIVO
// ==========================================

fileInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    handleFile(file);

});

// ==========================================
// PROCESAR ARCHIVO SELECCIONADO
// ==========================================

function handleFile(file) {

    if (!file || !file.type.startsWith("image/")) {
        return;
    }

    selectedFile = file;

    btnProcess.disabled = false;

    const reader = new FileReader();

    reader.onload = (e) => {

        // Mostrar imagen original
        imgOriginal.src = e.target.result;

        imgOriginal.classList.remove("d-none");

        // Limpiar resultado anterior
        uploadResult.src = "";
        uploadResult.classList.add("d-none");

        // Ocultar métricas anteriores
        metricsZone.classList.add("d-none");

        faceCount.textContent = "0";

        if (metricsFaceCount) {
            metricsFaceCount.textContent = "0";
        }

    };

    reader.readAsDataURL(file);

}

// ==========================================
// DETECTAR CARAS DE LA IMAGEN SUBIDA
// ==========================================

btnProcess.addEventListener("click", async () => {

    if (!selectedFile) {
        return;
    }

    const formData = new FormData();

    formData.append(
        "image",
        selectedFile
    );

    loader.classList.remove("d-none");

    uploadResult.classList.add("d-none");

    try {

        await sendUploadToBackend(formData);

    } finally {

        loader.classList.add("d-none");

    }

});

// ==========================================
// ENVIAR IMAGEN SUBIDA AL BACKEND
// ==========================================

async function sendUploadToBackend(formData) {

    try {

        const response = await fetch(
            "/api/detect",
            {
                method: "POST",
                body: formData
            }
        );

        if (!response.ok) {

            console.error(
                "Error HTTP:",
                response.status
            );

            return;
        }

        const data = await response.json();

        if (data.success) {

            // Mostrar resultado de la imagen subida
            uploadResult.src = data.image;

            uploadResult.classList.remove(
                "d-none"
            );

            // Actualizar contador
            faceCount.textContent =
                data.faces_detected;

            if (metricsFaceCount) {

                metricsFaceCount.textContent =
                    data.faces_detected;

            }

            metricsZone.classList.remove(
                "d-none"
            );

        }

    } catch (error) {

        console.error(
            "Error al procesar la imagen:",
            error
        );

    }

}

// ==========================================
// 8. LÓGICA MODO CÁMARA
// ==========================================

btnStartCamera.addEventListener(
    "click",
    async () => {

        await initCamera();

        btnStartCamera.disabled = true;

        btnStopCamera.disabled = false;

        btnToggleCamera.style.display =
            "inline-block";

    }
);

// ==========================================
// CAMBIAR CÁMARA
// ==========================================

btnToggleCamera.addEventListener(
    "click",
    async () => {

        currentFacingMode =
            currentFacingMode === "user"
                ? "environment"
                : "user";

        if (isStreaming) {

            clearInterval(
                streamInterval
            );

            if (streamInstance) {

                streamInstance
                    .getTracks()
                    .forEach(
                        (track) => track.stop()
                    );

            }

            await initCamera();

        }

    }
);

// ==========================================
// INICIAR CÁMARA
// ==========================================

async function initCamera() {

    try {

        streamInstance =
            await navigator.mediaDevices.getUserMedia(
                {
                    video: {
                        width: {
                            ideal: 400
                        },
                        height: {
                            ideal: 300
                        },
                        facingMode:
                            currentFacingMode
                    },

                    audio: false
                }
            );

        video.srcObject =
            streamInstance;

        isStreaming = true;

        imgResult.classList.remove(
            "d-none"
        );

        streamInterval =
            setInterval(
                processCameraFrame,
                600
            );

    } catch (err) {

        console.error(
            "Error al acceder a la cámara:",
            err
        );

        alert(
            "No se pudo acceder a la cámara seleccionada."
        );

        currentFacingMode =
            currentFacingMode === "user"
                ? "environment"
                : "user";

    }

}

// ==========================================
// DETENER CÁMARA
// ==========================================

btnStopCamera.addEventListener(
    "click",
    stopCameraFlow
);

function stopCameraFlow() {

    clearInterval(
        streamInterval
    );

    streamInterval = null;

    isStreaming = false;

    if (streamInstance) {

        streamInstance
            .getTracks()
            .forEach(
                (track) => track.stop()
            );

    }

    streamInstance = null;

    video.srcObject = null;

    btnStartCamera.disabled = false;

    btnStopCamera.disabled = true;

    btnToggleCamera.style.display =
        "none";

    loader.classList.add(
        "d-none"
    );

}

// ==========================================
// PROCESAR FRAME DE CÁMARA
// ==========================================

async function processCameraFrame() {

    if (!isStreaming) {
        return;
    }

    const ctx =
        canvas.getContext("2d");

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    canvas.toBlob(
        async (blob) => {

            if (!blob) {
                return;
            }

            const formData =
                new FormData();

            formData.append(
                "image",
                blob,
                "frame.jpg"
            );

            await sendCameraToBackend(
                formData
            );

        },
        "image/jpeg",
        0.7
    );

}

// ==========================================
// ENVIAR FRAME DE CÁMARA
// ==========================================

async function sendCameraToBackend(formData) {

    try {

        const response =
            await fetch(
                "/api/detect",
                {
                    method: "POST",
                    body: formData
                }
            );

        if (!response.ok) {
            return;
        }

        const data =
            await response.json();

        if (data.success) {

            imgResult.src =
                data.image;

            imgResult.classList.remove(
                "d-none"
            );

            metricsZone.classList.remove(
                "d-none"
            );

            faceCount.textContent =
                data.faces_detected;

            if (metricsFaceCount) {

                metricsFaceCount.textContent =
                    data.faces_detected;

            }

        }

    } catch (error) {

        console.error(
            "Error en la transmisión de datos:",
            error
        );

    }

}