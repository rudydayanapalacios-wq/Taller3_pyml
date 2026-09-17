from flask import Flask, request, jsonify, send_from_directory
import cv2
import numpy as np
import base64
import os

app = Flask(__name__, static_folder="../public")


# ==========================================
# CARGAR CLASIFICADOR HAAR
# ==========================================

CASCADE_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "haarcascade_frontalface_default.xml"
)

face_classifier = cv2.CascadeClassifier(CASCADE_PATH)


# Verificar que el archivo XML se haya cargado correctamente
if face_classifier.empty():
    raise RuntimeError(
        f"No se pudo cargar el clasificador Haar: {CASCADE_PATH}"
    )


# ==========================================
# SERVIR FRONTEND
# ==========================================

@app.route("/")
def serve_index():
    return send_from_directory(
        app.static_folder,
        "index.html"
    )


@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(
        app.static_folder,
        path
    )


# ==========================================
# DETECCIÓN DE ROSTROS
# ==========================================

@app.route("/api/detect", methods=["POST"])
def detect_faces():

    if "image" not in request.files:
        return jsonify({
            "error": "No se proporcionó ninguna imagen"
        }), 400

    file = request.files["image"]

    try:

        # Leer archivo recibido
        filestr = file.read()

        # Convertir los bytes a imagen
        npimg = np.frombuffer(
            filestr,
            np.uint8
        )

        img = cv2.imdecode(
            npimg,
            cv2.IMREAD_COLOR
        )

        if img is None:
            return jsonify({
                "error": "Formato de imagen inválido"
            }), 400


        # ==========================================
        # CREAR COPIA PARA EL RESULTADO
        # ==========================================

        output_img = img.copy()


        # ==========================================
        # CONVERTIR A ESCALA DE GRISES
        # ==========================================

        gray_image = cv2.cvtColor(
            img,
            cv2.COLOR_BGR2GRAY
        )


        # ==========================================
        # DETECTAR ROSTROS
        # ==========================================

        faces = face_classifier.detectMultiScale(
            gray_image,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(40, 40)
        )


        # ==========================================
        # DIBUJAR RECTÁNGULOS
        # ==========================================

        for x, y, w, h in faces:

            cv2.rectangle(
                output_img,
                (x, y),
                (x + w, y + h),
                (0, 255, 0),
                3
            )


        # ==========================================
        # CONVERTIR IMAGEN A JPG
        # ==========================================

        _, buffer = cv2.imencode(
            ".jpg",
            output_img
        )


        # ==========================================
        # CONVERTIR A BASE64
        # ==========================================

        encoded_image = base64.b64encode(
            buffer
        ).decode("utf-8")


        # ==========================================
        # RESPUESTA
        # ==========================================

        return jsonify({
            "success": True,
            "faces_detected": len(faces),
            "image": f"data:image/jpeg;base64,{encoded_image}"
        })


    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ==========================================
# CONFIGURACIÓN PARA VERCEL
# ==========================================

app.debug = False