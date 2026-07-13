# Recolector de Frases 

Una aplicación web interactiva tipo "muro de post-its" (lluvia de ideas) que permite a los usuarios escribir y compartir frases, comentarios o ideas. Las frases enviadas se muestran dinámicamente en un tablero visual y se almacenan automáticamente en un documento de Google Sheets.

 **¡Proyecto desplegado en vivo!** Puedes probar la aplicación aquí: [https://recolector-frases.onrender.com/](https://recolector-frases.onrender.com/)

---

##  Características

* **Tablero Interactivo:** Las frases aparecen como "post-its" con colores y rotaciones aleatorias pero deterministas, creando un aspecto visual dinámico y atractivo.
* **Límite de Caracteres:** Formulario protegido con un contador en tiempo real (hasta 300 caracteres).
* **Almacenamiento en la Nube:** Utiliza un backend en Node.js que se comunica con **Google Apps Script** para guardar permanentemente cada frase en un Google Sheet.
* **Diseño Responsivo:** Interfaz adaptable (Grid layout) que funciona perfectamente tanto en móviles como en computadoras de escritorio.
* **Descarga de Datos:** Enlace directo para descargar el historial de frases en formato CSV.

##  Tecnologías Utilizadas

**Frontend:**
* HTML5, CSS3 y JavaScript puro (Vanilla JS).
* Variables CSS personalizadas y cálculos dinámicos de interfaz.

**Backend:**
* **Node.js** con **Express.js** para el servidor web y la creación de la API (`/api/phrases`).
* **CORS** para el manejo de peticiones de origen cruzado.

**Base de Datos / Almacenamiento:**
* **Google Sheets** (a través de Google Apps Script) para el registro de los datos enviados (frase, IP, timestamp).

##  Estructura del Proyecto

```text
recolector-frases/
├── public/                 # Archivos estáticos del frontend
│   ├── app.js              # Lógica del cliente, renderizado de post-its
│   ├── index.html          # Interfaz de usuario principal
│   └── styles.css          # Estilos visuales del tablero y la UI
├── server.js               # Servidor Express y endpoints de la API
├── package.json            # Dependencias del proyecto y scripts
├── .gitignore              # Archivos excluidos del control de versiones
└── node_modules/           # (Generado tras instalar dependencias)
