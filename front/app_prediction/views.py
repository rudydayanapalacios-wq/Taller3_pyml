import requests
from django.shortcuts import render


API_URL = "https://taller3pyml-production-d263.up.railway.app/predict"


def index(request):
    resultado = None
    error = None

    if request.method == "POST":
        metros = request.POST.get("metros")

        try:
            respuesta = requests.post(
                API_URL,
                json={"area_m2": float(metros)}
            )

            if respuesta.status_code == 200:
                resultado = respuesta.json()
            else:
                error = "No se pudo realizar la predicción."

        except Exception:
            error = "No se pudo conectar con la API."

    return render(
        request,
        "app_prediction/index.html",
        {
            "resultado": resultado,
            "error": error
        }
    )