# Taller 3 — Machine Learning

> **Sistema de Diagnóstico Clínico, Regresión Lineal y Visión Artificial**

Proyecto académico desarrollado con Python que integra diferentes modelos de Machine Learning, aplicaciones web, APIs y herramientas de visión artificial.

---

## ✦ Descripción

El proyecto está compuesto por tres áreas principales:

* **Random Forest:** modelo utilizado para realizar predicciones clínicas.
* **Regresión Lineal:** modelo utilizado para predecir precios de viviendas a partir de su área en metros cuadrados.
* **Visión Artificial:** sistema de detección facial mediante OpenCV y Haar Cascade.

Para complementar los modelos se utilizaron **Streamlit, FastAPI, Django, Flask, Railway y Vercel**.

---

## ⌂ Estructura del proyecto

```text
Taller3_pyml/
│
├── Model_ML/
│   │
│   ├── RandomForest/
│   │   ├── 3.Predecir_enefermedad.py
│   │   ├── models/
│   │   │   └── modelo_random_forest_ampliado.pkl
│   │   └── requirements.txt
│   │
│   ├── Regresionlineal/
│   │   └── back/
│   │       ├── main.py
│   │       ├── DockerFile
│   │       ├── requirements.txt
│   │       └── models/
│   │           └── linear_model.joblib
│   │
│   └── Visionartificial/
│       └── index.ipynb
│
├── py_img/
│   │
│   ├── api/
│   │   └── index.py
│   │
│   ├── public/
│   │   ├── index.html
│   │   ├── script.js
│   │   ├── style.css
│   │   ├── wallpaper.jpg
│   │   └── logosena.png
│   │
│   ├── haarcascade_frontalface_default.xml
│   ├── requirements.txt
│   ├── vercel.json
│   └── README.md
│
├── front/
│   ├── config/
│   ├── app_prediction/
│   ├── manage.py
│   ├── db.sqlite3
│   └── requirements.txt
│
├── venv/
│
└── README.md
```

> `venv/` corresponde al entorno virtual local y no es necesario subirlo al repositorio.

---

## 01 · Random Forest

El proyecto incluye un modelo de **Random Forest** encargado de generar predicciones a partir de diferentes características de entrada.

El modelo entrenado se encuentra en:

```text
Model_ML/RandomForest/models/
└── modelo_random_forest_ampliado.pkl
```

### Tecnologías

* Python
* Pandas
* NumPy
* Scikit-learn
* Joblib
* Streamlit
* Plotly

---

## 02 · Requirements

Las principales dependencias utilizadas en el proyecto son:

```text
pandas
numpy
scikit-learn
joblib
streamlit
plotly
opencv-python
```

Las versiones específicas se encuentran definidas en los archivos `requirements.txt` de cada módulo.

---

## 03 · Ejecución en local

### Crear el entorno virtual

```bash
python -m venv venv
```

### Activar el entorno virtual

En Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

### Instalar las dependencias

```powershell
pip install -r requirements.txt
```

### Ejecutar Streamlit

Desde la raíz del proyecto:

```powershell
python -m streamlit run .\Model_ML\RandomForest\3.Predecir_enefermedad.py
```

La aplicación se abrirá automáticamente en el navegador.

---

## 04 · Regresión Lineal

El proyecto incluye un modelo de **Regresión Lineal** utilizado para predecir el precio de una vivienda a partir de su superficie en metros cuadrados.

El modelo entrenado se encuentra en:

```text
Model_ML/Regresionlineal/back/models/
└── linear_model.joblib
```

### Backend

El backend está desarrollado con:

* Python
* FastAPI
* NumPy
* Scikit-learn
* Joblib

La API recibe el área de la vivienda y devuelve el precio estimado por el modelo.

---

## 05 · Frontend Django

Se desarrolló un frontend utilizando **Django**, encargado de proporcionar una interfaz web para interactuar con el modelo de regresión lineal.

```text
front/
├── config/
├── app_prediction/
├── manage.py
├── db.sqlite3
└── requirements.txt
```

El frontend se comunica con el backend de FastAPI para realizar las predicciones.

---

## 06 · Visión Artificial

Como parte del proyecto se implementó un sistema de **detección facial en tiempo real** utilizando la cámara del computador.

La implementación inicial se encuentra en:

```text
Model_ML/Visionartificial/index.ipynb
```

### Funcionamiento

1. Se accede a la cámara mediante `cv2.VideoCapture(0)`.
2. Se captura cada fotograma del video.
3. El fotograma se convierte a escala de grises.
4. Se utiliza un clasificador Haar Cascade.
5. Se identifican los rostros encontrados.
6. Se dibuja un recuadro delimitador.
7. El resultado se muestra en tiempo real.

### Clasificador

```text
haarcascade_frontalface_default.xml
```

El clasificador está orientado principalmente a la detección de **rostros frontales**.

### Tecnologías

* Python
* OpenCV
* Haar Cascade Classifier
* Jupyter Notebook

---

## 07 · Aplicación web de Visión Artificial

La aplicación web desarrollada a partir del proyecto de visión artificial se encuentra en:

```text
py_img/
│
├── api/
│   └── index.py
│
├── public/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   ├── wallpaper.jpg
│   └── logosena.png
│
├── haarcascade_frontalface_default.xml
├── requirements.txt
└── vercel.json
```

### Backend

El archivo:

```text
py_img/api/index.py
```

contiene la API encargada de recibir las imágenes, procesarlas mediante OpenCV y devolver el resultado de la detección.

### Frontend

Los archivos ubicados en:

```text
py_img/public/
```

contienen la interfaz web.

La aplicación permite:

* Cargar imágenes.
* Detectar rostros.
* Mostrar el resultado.
* Acceder a la cámara.
* Realizar detección en tiempo real.

---

## 08 · Tecnologías utilizadas

| Tecnología       | Aplicación                 |
| ---------------- | -------------------------- |
| Python           | Lenguaje principal         |
| Pandas           | Manipulación de datos      |
| NumPy            | Procesamiento numérico     |
| Scikit-learn     | Machine Learning           |
| Random Forest    | Predicción y clasificación |
| Regresión Lineal | Predicción de precios      |
| Joblib           | Gestión de modelos         |
| Streamlit        | Aplicación interactiva     |
| FastAPI          | API de predicción          |
| Django           | Aplicación web             |
| Flask            | API de visión artificial   |
| OpenCV           | Procesamiento de imágenes  |
| Haar Cascade     | Detección facial           |
| GitHub           | Control de versiones       |
| Railway          | Despliegue                 |
| Vercel           | Despliegue                 |

---

# ◌ Despliegues

### Streamlit · Sistema de Diagnóstico Clínico

[Abrir Sistema de Diagnóstico Clínico](https://taller3pyml-rknuccl4d5dqw34cjxje4z.streamlit.app/)

### FastAPI · API de predicción

[Abrir API](https://taller3pyml-production-d263.up.railway.app/)

### Django · Frontend

[Abrir Frontend](https://taller3pyml-production-3182.up.railway.app/)

### Vercel · Visión Artificial

[Abrir aplicación de detección facial](https://py-lybfqacxh-rudy-05c0.vercel.app/)

Aplicación web de detección facial desarrollada a partir del proyecto `py_img` y desplegada mediante Vercel.

---

## ♡ Proyecto académico

**Taller 3 — Machine Learning**

Desarrollado utilizando herramientas de Machine Learning, desarrollo web, APIs y visión artificial.
