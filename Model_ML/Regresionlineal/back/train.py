import joblib
import numpy as np
import matplotlib.pyplot as plt

from sklearn.linear_model import LinearRegression

# Predecir precios de viviendas según la superficie en m²

# Datos de entrenamiento (X) y (y)
X = np.array([[40], [50], [60], [85], [100], [120]])
y = np.array([21000000, 30000000, 35000000, 50000000, 60000000, 70000000])

# Entrenar el modelo de regresión lineal
modelo = LinearRegression()
modelo.fit(X, y)

# # Predicciones de prueba
# y_pred = modelo.predict(X)

# # Imprimir la información del modelo entrenado
# print("Coeficiente de regresión:", modelo.coef_[0])
# print("Término independiente:", modelo.intercept_)

# # Graficar los datos de entrenamiento
# plt.scatter(X, y, color="red", label="Datos de entrenamiento")

# # Graficar la línea de regresión
# plt.plot(X, y_pred, color="blue", label="Línea de regresión")

# plt.xlabel("Superficie (m²)")
# plt.ylabel("Precio (COP)")
# plt.title("Regresión Lineal: Precio de Viviendas según su Superficie")
# plt.legend()
# plt.grid(True)

# # Mostrar gráfica
# plt.show()

# Guardar el modelo entrenado
joblib.dump(
    modelo,
    "models/linear_model.joblib"
)

print("Modelo guardado correctamente.")