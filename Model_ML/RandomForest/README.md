# 🩺 Sistema de Diagnóstico Clínico Avanzado

> **Sistema de predicción clínica desarrollado con Machine Learning y Python.**

Aplicación web interactiva desarrollada con **Streamlit**, que utiliza un modelo de **Random Forest** para analizar diferentes características y generar una predicción entre varias posibles condiciones.

---

### 🧾 Requirements

Las principales dependencias utilizadas en el proyecto son:

* `pandas`
* `numpy`
* `scikit-learn`
* `joblib`
* `streamlit`
* `plotly`

Las versiones específicas se encuentran definidas en el archivo `requirements.txt`.

---

## ✦ Pasos para ejecutar el sistema

### 01 · Crear el entorno virtual

Crea un entorno virtual para mantener aisladas las dependencias del proyecto.

```bash
python -m venv venv
```

En Windows, actívalo con:

```powershell
.\venv\Scripts\Activate.ps1
```

---

### 02 · Instalar las dependencias

Con el entorno virtual activado, instala las librerías necesarias:

```bash
pip install -r requirements.txt
```

---

### 03 · Ejecutar el proyecto en local

Inicia la aplicación de Streamlit con:

```bash
python -m streamlit run .\Model_ML\RandomForest\3.Predecir_enefermedad.py
```

La aplicación se abrirá automáticamente en el navegador.

---

### 04 · Deploy

> ☁️ **Aplicación desplegada en Streamlit Community Cloud**

Accede al sistema directamente desde:

**[↗ Abrir Sistema de Diagnóstico Clínico](https://taller3pyml-rknuccl4d5dqw34cjxje4z.streamlit.app/)**

---
