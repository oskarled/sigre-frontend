# 📄 Guía de Descarga de Certificados en PDF - Sistema SIGRE

## 🎯 Descripción General

El Sistema SIGRE cuenta con una funcionalidad completa para generar y descargar certificados en formato PDF directamente en el equipo local. Los certificados se generan con alta calidad profesional en tamaño carta horizontal (landscape).

---

## 📋 Características de los Certificados

### Especificaciones Técnicas:
- **Formato:** PDF
- **Tamaño:** Carta (8.5 x 11 pulgadas / 215.9 x 279.4 mm)
- **Orientación:** Horizontal (Landscape)
- **Calidad:** Alta resolución (scale 3x-8x)
- **Tecnologías:** jsPDF + html2canvas

### Elementos del Certificado:
1. ✅ Logo ECM Training Center
2. ✅ Información del centro de formación
3. ✅ Nombre completo del participante
4. ✅ Documento de identidad
5. ✅ Nombre del curso completado
6. ✅ Duración del curso (horas)
7. ✅ Fechas de inicio y finalización
8. ✅ Calificación obtenida
9. ✅ Firma del instructor certificado
10. ✅ Firma del director/representante legal
11. ✅ Fecha de emisión
12. ✅ Decoraciones profesionales (bordes, esquinas decorativas)
13. ✅ Gradientes corporativos (naranja-rojo)

---

## 🚀 Cómo Descargar Certificados

### Opción 1: Desde la Tabla de Certificados

**Ubicación:** Menú Principal > CERTIFICADOS (administrador e instructor) o MIS CERTIFICADOS (participante)

**Pasos:**
1. Navega a la sección "CERTIFICADOS"
2. Localiza el certificado deseado en la tabla
3. Haz clic en el botón **"PDF"** (verde) en la columna de acciones
4. Espera el mensaje "Generando certificado PDF..."
5. El archivo se descargará automáticamente con el nombre:
   ```
   Certificado_[NombreParticipante]_[NombreCurso].pdf
   ```

**Características:**
- ✅ Descarga instantánea desde la tabla
- ✅ No requiere abrir el editor
- ✅ Genera certificado con datos guardados
- ✅ Notificación toast de confirmación

---

### Opción 2: Desde el Diseñador de Certificados

**Ubicación:** Certificados > Botón "Ver" o "Nuevo Certificado"

**Pasos:**
1. Haz clic en **"Ver"** en cualquier certificado de la tabla
2. Se abrirá el diseñador con vista previa en tiempo real
3. Edita los datos del certificado si es necesario:
   - Nombre del participante
   - Documento de identidad
   - Curso
   - Fechas (inicio/fin)
   - Calificación
   - Instructor
   - Duración
   - Lugar de emisión
   - Número de registro
   - Observaciones
4. La vista previa se actualiza en tiempo real
5. Haz clic en **"Descargar PDF"** (botón verde)
6. El PDF se generará y descargará automáticamente

**Características:**
- ✅ Vista previa en tiempo real
- ✅ Editor completo de datos
- ✅ Ventana redimensionable y arrastrable
- ✅ Botón maximizar/minimizar
- ✅ Validación de campos obligatorios

---

## 💾 Ubicación de Descarga

Los certificados se descargan en la carpeta de descargas predeterminada del navegador:

### Windows:
```
C:\Users\[Usuario]\Downloads\
```

### macOS:
```
/Users/[Usuario]/Downloads/
```

### Linux:
```
/home/[usuario]/Downloads/
```

---

## 📝 Nomenclatura de Archivos

Los archivos se nombran automáticamente siguiendo este patrón:

```
Certificado_[NombreParticipante]_[NombreCurso].pdf
```

**Ejemplos:**
- `Certificado_Carlos_Alberto_Rodriguez_Trabajos_en_Alturas.pdf`
- `Certificado_Maria_Fernanda_Gomez_Seguridad_Industrial.pdf`

**Notas:**
- Los espacios se reemplazan por guiones bajos (_)
- Se eliminan caracteres especiales
- El nombre es único para cada combinación participante-curso

---

## 🎨 Personalización del Certificado

### Campos Editables en el Diseñador:

1. **Datos del Participante:**
   - Nombre completo
   - Número de documento

2. **Datos del Curso:**
   - Nombre del curso
   - Duración (horas)
   - Fechas de inicio y fin

3. **Evaluación:**
   - Calificación (0-100)

4. **Instructor:**
   - Nombre del instructor

5. **Información Adicional:**
   - Lugar de emisión
   - Número de registro
   - Observaciones

---

## 🔧 Solución de Problemas

### El PDF no se descarga:

**Problema:** El botón no responde o no inicia la descarga.

**Soluciones:**
1. Verifica que el navegador permita descargas automáticas
2. Revisa que los campos obligatorios estén completos:
   - Nombre del participante
   - Nombre del curso
3. Intenta desactivar bloqueadores de ventanas emergentes
4. Limpia la caché del navegador

---

### El PDF se ve borroso o pixelado:

**Problema:** La calidad del certificado no es óptima.

**Soluciones:**
1. El sistema ya usa escala alta (3x-8x) automáticamente
2. Si persiste, contacta al administrador del sistema
3. Verifica la versión de html2canvas (debe ser 1.4.1)

---

### Error "Complete los campos obligatorios":

**Problema:** Faltan datos necesarios para generar el certificado.

**Solución:**
1. Asegúrate de completar:
   - **Obligatorio:** Nombre del participante
   - **Obligatorio:** Nombre del curso
2. Los demás campos son opcionales pero recomendados

---

### El certificado tiene datos incorrectos:

**Problema:** Los datos en el PDF no son correctos.

**Solución:**
1. Usa el diseñador de certificados (botón "Ver")
2. Edita los campos necesarios
3. La vista previa se actualiza automáticamente
4. Vuelve a descargar el PDF

---

## 📱 Compatibilidad

### Navegadores Compatibles:
- ✅ Google Chrome (recomendado)
- ✅ Microsoft Edge
- ✅ Mozilla Firefox
- ✅ Safari
- ✅ Opera

### Sistemas Operativos:
- ✅ Windows 10/11
- ✅ macOS (todas las versiones recientes)
- ✅ Linux (Ubuntu, Fedora, etc.)

---

## 🔒 Seguridad y Privacidad

- Los certificados se generan localmente en el navegador
- No se envían datos a servidores externos
- Los archivos PDF se guardan únicamente en tu equipo
- La generación usa tecnologías client-side (jsPDF + html2canvas)

---

## 📊 Estadísticas de Uso

El sistema lleva un registro de:
- Total de certificados emitidos
- Certificados pendientes
- Certificados emitidos por mes
- Estado de cada certificado (Emitido/Pendiente/Anulado)

---

## 🎓 Certificados para Instructores

El sistema también permite generar certificados para instructores con diseño especializado:

**Acceso:** Instructores > Certificaciones del Instructor

**Incluye:**
- Certificación profesional
- Especialidades
- Entidad certificadora
- Fecha de emisión y vencimiento
- Número de certificado
- Horas de formación
- Competencias adquiridas

---

## 💡 Tips y Mejores Prácticas

1. **Verifica los datos antes de descargar:**
   - Revisa nombres, fechas y calificaciones
   - Usa la vista previa para confirmar

2. **Organiza tus descargas:**
   - Crea carpetas por curso o fecha
   - Renombra archivos si es necesario

3. **Respaldo:**
   - Guarda copias de certificados importantes
   - Considera usar almacenamiento en la nube

4. **Impresión:**
   - Los certificados están optimizados para impresión
   - Usa papel de alta calidad (preferiblemente carta)
   - Imprime en orientación horizontal

5. **Calidad:**
   - Los PDFs mantienen alta resolución
   - Aptos para impresión profesional
   - Válidos para presentación oficial

---

## 📞 Soporte

Si experimentas problemas con la descarga de certificados:

1. Revisa esta guía de solución de problemas
2. Consulta con el administrador del sistema
3. Verifica los requisitos del navegador
4. Asegúrate de tener permisos de descarga

---

## 🔄 Actualizaciones Futuras

Próximas mejoras planificadas:
- [ ] Firma digital de certificados
- [ ] Código QR de verificación
- [ ] Múltiples plantillas de diseño
- [ ] Descarga masiva de certificados
- [ ] Envío automático por email
- [ ] Integración con blockchain para validación

---

## 📄 Versión del Sistema

**Sistema:** SIGRE v1.1  
**Módulo:** Gestión de Certificados  
**Última actualización:** Octubre 2026  
**Desarrollado por:** ECM Training Center

---

**© 2026 ECM Training Center - Todos los derechos reservados**
