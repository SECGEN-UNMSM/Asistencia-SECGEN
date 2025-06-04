# Sistema de Asistencia

Este es un programa que ejecuta un sistema de asistencia que registra la asistencia de los participantes y genera un reporte en PDF.

Pasos para ejecutar tauri
1. Instalar Rust, Node.js y el cliente de Tauri.
2. Para Windows: Instalar Visual Studio Build Tolls y Microsoft Edge WebView2 Runtime
3. Iniciar Tauri dentro del proyecto con el comando `npx tauri init`
4. Correr el proyecto en desarrollo con Tauri con el comando `npx tauri dev`
5. Llevar el proyecto a producción con el comando `npm run build`
6. Configurar el identifier en `tauri.conf`
7. Generar el ejecutable e instalador del proyecto con el comando `npx tauri build`