from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

import cv2
import numpy as np


# ============================================
# CREAR API
# ============================================

app = FastAPI(
    title="API Detección Facial"
)


# ============================================
# CONFIGURACIÓN CORS
# ============================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# CARGAR CLASIFICADOR HAAR
# ============================================

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades
    + "haarcascade_frontalface_default.xml"
)


# Verificar que el clasificador se haya cargado
if face_cascade.empty():
    print("ERROR: No se pudo cargar el clasificador Haar.")
else:
    print("Clasificador Haar cargado correctamente.")


# ============================================
# RUTA PRINCIPAL
# ============================================

@app.get("/")
def inicio():

    return {
        "success": True,
        "message": "API de detección facial funcionando"
    }


# ============================================
# DETECCIÓN DE ROSTROS
# ============================================

@app.post("/detect")
async def detectar_rostro(
    file: UploadFile = File(...)
):

    # ----------------------------------------
    # Leer imagen enviada por el frontend
    # ----------------------------------------

    contenido = await file.read()


    # ----------------------------------------
    # Convertir los bytes en una imagen OpenCV
    # ----------------------------------------

    image_array = np.frombuffer(
        contenido,
        np.uint8
    )


    frame = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR
    )


    # ----------------------------------------
    # Verificar que la imagen sea válida
    # ----------------------------------------

    if frame is None:

        print("ERROR: No se pudo leer la imagen.")

        return {
            "success": False,
            "faces": []
        }


    # ----------------------------------------
    # Convertir imagen a escala de grises
    # ----------------------------------------

    gray_img = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2GRAY
    )


    # ----------------------------------------
    # Detectar rostros
    # ----------------------------------------

    faces = face_cascade.detectMultiScale(
        gray_img,
        1.1,
        10,
        minSize=(40, 40)
    )


    # ----------------------------------------
    # Preparar resultados
    # ----------------------------------------

    resultados = []


    for (x, y, w, h) in faces:

        resultados.append({

            "x": int(x),

            "y": int(y),

            "width": int(w),

            "height": int(h)

        })


    # ----------------------------------------
    # MOSTRAR RESULTADO EN LA TERMINAL
    # ----------------------------------------

    print(
        "ROSTROS DETECTADOS:",
        resultados
    )


    # ----------------------------------------
    # Respuesta para el frontend
    # ----------------------------------------

    return {

        "success": True,

        "faces": resultados

    }