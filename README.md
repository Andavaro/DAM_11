# Proyecto IoT con Ionic y Angular

## Descripción
Este proyecto consiste en una aplicación móvil desarrollada con **Ionic** y **Angular** para gestionar dispositivos IoT. La app interactúa con dispositivos, muestra mediciones de sensores y controla válvulas de manera remota. Se incluye un backend simulado para interactuar con datos de una base de datos local utilizando **XAMPP** y **Node.js**.

## Tecnologías utilizadas
- **Ionic**: Framework para construir aplicaciones móviles con tecnologías web (HTML, CSS, JavaScript).
- **Angular**: Framework de desarrollo web que estructura la aplicación y proporciona herramientas de desarrollo robustas.
- **TypeScript**: Lenguaje que agrega tipado a JavaScript.
- **SCSS**: Preprocesador CSS para mejorar la organización de los estilos.
- **XAMPP**: Paquete para crear un servidor local con MySQL para la base de datos.
- **Node.js**: Para crear un servidor backend simulado que interactúa con la base de datos.
- **MySQL**: Base de datos que almacena los dispositivos, mediciones y registros de riego.

## Instalación

### Requisitos previos
1.  **Node.js**: Asegúrate de tener **Node.js** instalado. Puedes verificarlo con el siguiente comando:
    ```bash
    node -v
    ```
    Si no tienes Node.js, puedes descargarlo desde [nodejs.org](https://nodejs.org/).

2.  **Ionic CLI**: Instala Ionic utilizando el siguiente comando:
    ```bash
    npm install -g @ionic/cli
    ```

3.  **XAMPP**: Si deseas usar la base de datos local, instala XAMPP para crear el servidor MySQL.

### Instalación del proyecto
1.  **Clonar este repositorio**
2.  **Configurar la base de datos**:
    - Abre XAMPP y enciende Apache y MySQL.
    - Accede a `phpMyAdmin` y crea la base de datos llamada `riegodb`.
    - Importa el archivo `riegodb.sql` que contiene la estructura y datos de las tablas.
3.  **Instalar dependencias en el servidor**:
    - Accede a la carpeta `servidor`.
    - Instala las dependencias:
      ```bash
      npm install
      ```
4.  **Instalar dependencias**:
    - Accede a la carpeta `IoTApp`.
    - Instala las dependencias:
      ```bash
      npm install
      ```

### Ejecutar la aplicación


1.**Inicia el servidor**:
    ```bash
    npm run dev
    ```
3.  **Iniciar la app**:
    En el directorio raíz del proyecto, ejecuta:
    ```bash
    ionic serve
    ```
    Esto abrirá el proyecto en el navegador para pruebas locales.

4.  **Abrir la aplicación en un dispositivo móvil**:
    Si deseas probar la app en un dispositivo móvil, primero ejecuta:
    ```bash
    ionic capacitor run ios
    ```
    (o `android`).

## Funcionalidad de la aplicación

### 1. HomePage
- **Descripción**: Muestra una lista de todos los dispositivos IoT disponibles.
- **Funcionalidad**:
    - Carga los dispositivos desde el backend.
    - Permite hacer clic en un dispositivo para navegar a su página de detalles.

### 2. DeviceDetailPage
- **Descripción**: Muestra los detalles de un dispositivo específico.
- **Funcionalidad**:
    - Muestra la última medición de humedad registrada por el sensor.
    - Permite accionar la electroválvula asociada (abrir/cerrar).
    - Navega a la página de historial de mediciones.

### 3. HistoryPage
- **Descripción**: Muestra el historial de mediciones de un dispositivo.
- **Funcionalidad**:
    - Muestra una lista cronológica de todas las mediciones registradas para ese dispositivo.

### 4. Interacción con la base de datos
- **Dispositivos**: La app interactúa con una base de datos que almacena los dispositivos, cada uno con un nombre y ubicación.
- **Mediciones**: Se guardan y leen las mediciones de humedad de cada dispositivo.
- **Válvulas**: Cada dispositivo tiene una electroválvula asociada, y sus cambios de estado (apertura/cierre) se registran en un log.
