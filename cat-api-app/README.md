# Proyecto de Gestión de Imágenes

**Ciclo**: Desarrollo de Aplicaciones Web (DAW)  
**Alumno**: [Noelia Tinajero Ortiz]

## Índice

1. [Introducción](#introducción)
2. [Funcionalidades del Proyecto y Tecnologías Utilizadas](#funcionalidades-del-proyecto-y-tecnologías-utilizadas)
3. [Guía de Instalación](#guía-de-instalación)
4. [Guía de Uso](#guía-de-uso)
5. [Enlace a la Documentación](#enlace-a-la-documentación)
6. [Enlace a Figma de la Interfaz](#enlace-a-figma-de-la-interfaz)
7. [Conclusión](#conclusión)
8. [Contribuciones, Agradecimientos y Referencias](#contribuciones-agradecimientos-y-referencias)
9. [Licencias](#licencias)
10. [Contacto](#contacto)

## Introducción

**Descripción del Proyecto**: Este proyecto es una aplicación de React que permite a los usuarios iniciar sesión con Google, ver imágenes, seleccionar imágenes y pagar por las imágenes seleccionadas. Utiliza la API de Google para la autenticación y una API backend para gestionar las imágenes y los datos del usuario.

**Justificación**: La necesidad de una aplicación sencilla y eficiente para gestionar imágenes de manera segura y rápida.

**Objetivos**: 
- Facilitar la gestión y visualización de imágenes.
- Implementar un sistema de autenticación seguro.
- Proveer una interfaz intuitiva y fácil de usar.

**Motivación**: Crear una herramienta útil para usuarios que necesitan gestionar grandes cantidades de imágenes de forma organizada y segura.

## Funcionalidades del Proyecto y Tecnologías Utilizadas

### Funcionalidades
- Inicio de sesión con Google.
- Visualización de imágenes.
- Selección de imágenes.
- Almacenamiento y pago por imágenes seleccionadas.

### Tecnologías Utilizadas
- **React**: Biblioteca principal para la construcción de la interfaz.
- **gapi-script**: Script para cargar y usar la API de Google.
- **dotenv**: Para cargar variables de entorno desde un archivo `.env`.

## Guía de Instalación

1. Clona este repositorio en tu máquina local:

    ```bash
    git clone https://github.com/https-github-com-proyecto-tfg/Front.git
    cd tu-repositorio
    ```

2. Instala las dependencias del proyecto:

    ```bash
    npm install
    ```

    o si prefieres usar yarn:

    ```bash
    yarn install
    ```

3. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido, reemplazando `YOUR_GOOGLE_CLIENT_ID` con el ID de cliente de OAuth2 de Google:

    ```env
    REACT_APP_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    ```

## Guía de Uso

Para iniciar la aplicación en modo de desarrollo, ejecuta:

    ```bash
    npm start
    ```

    o si prefieres usar yarn:

    ```bash
    yarn start
    ```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

1. **Iniciar sesión**: Inicia sesión con tu cuenta de Google.
2. **Ver imágenes**: Selecciona entre ver una imagen o diez imágenes.
3. **Seleccionar imágenes**: Haz clic en las imágenes para seleccionarlas y añadirlas a tu cesta.
4. **Pagar por imágenes**: Ve a la cesta y realiza el pago por las imágenes seleccionadas.

## Enlace a la Documentación

[Documentación del Proyecto](cat-api-app/CatApi.docx)

## Enlace a Figma de la Interfaz

[Diseño de Interfaz en Figma](https://www.figma.com/design/nVoF7Y4tbyNGQYX8rg9EpD/CatApi?node-id=0-1&t=yL39z6aUv5cEn1WC-0)

## Conclusión

Este proyecto demuestra cómo integrar autenticación con Google y gestión de imágenes en una aplicación React. La aplicación es fácil de usar y proporciona una manera eficiente de gestionar imágenes.

## Contribuciones, Agradecimientos y Referencias

Agradecimientos especiales a mis profesores y compañeros que ayudaron en la realización de este proyecto.

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Google API Documentation](https://developers.google.com/identity/sign-in/web/sign-in)

## Licencias

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## Contacto

**Nombre**: Noelia Tinajero Ortiz  
**Email**: noelia.tinajero@a.vedrunasevillasj.es  
**GitHub**: [NoeliaTinajeroOrtiz](https://github.com/NoeliaTinajeroOrtiz)
