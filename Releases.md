# Notas de la Versión: Versión 1.1.0

## 🆕 Nuevas Funcionalidades  
### Archivos de Notas de la Versión  
- Se añadieron archivos de notas de la versión para mejorar la documentación de las actualizaciones.  

### Mejoras en el Perfil del Paciente  
- **Tabla de Prescripciones**:  
  - Se añadió una tabla de prescripciones en la página del perfil del paciente para mostrar las prescripciones específicas del paciente.  
- **Paginación**:  
  - Se habilitó la paginación en la tabla de prescripciones para una mejor usabilidad.  
- **Añadir Datos Faltantes**:  
  - Se introdujeron opciones para añadir medicamentos y mediciones faltantes directamente desde el perfil del paciente.  

## 🔧 Actualizaciones de Servicios API  
### Nuevos Archivos de Servicios para Consultas API  
- **PrescriptionService.js**: Añadidas funciones para gestionar prescripciones:  
  - `getPrescriptionByPatient`, `createPrescription`, `editPrescription`, `activatePrescription`, `disablePrescription`.  
- **MedicationService.js**: Añadidas funciones para gestionar medicamentos:  
  - `getMedication`, `getMedicationByID`, `addMedication`.  
- **MeasureService.js**: Añadidas funciones para gestionar mediciones:  
  - `getMeasure`, `getMeasureByID`, `addMeasure`.  
- **PrescriptionMedicationService.js**: Añadidas funciones para gestionar relaciones entre prescripciones y medicamentos:  
  - `getPrescriptionMedication`, `createPrescriptionMedication`, `editPrescriptionMedication`, `activatePrescriptionMedication`, `disablePrescriptionMedication`.  

### Mejoras en UserService.js  
- Se añadieron nuevas funcionalidades:  
  - `validateToken`, `changeUserPassword`, `forgotPassword`, `newUserPassword`.  

## 💻 Actualizaciones de UI/UX  
### Nuevos Modales  
- Se añadieron modales para mejorar la interacción del usuario:  
  - `PrescriptionEdit`, `PrescriptionInfo`, `MedicationModal`, `MedicationEdit`.  

### Validación de Formularios  
- Validación mejorada en todos los formularios de prescripciones para que se active con los cambios de entrada.  

### Flujo de Recuperación de Contraseña  
- **Página de Recuperación de Contraseña**:  
  - Se actualizó la página y el flujo de recuperación de contraseña para alinearse con el nuevo proceso.  
- **Modal de Cambio de Contraseña**:  
  - Se añadió un modal para cambiar la contraseña de forma más sencilla.  

## 🐛 Corrección de Errores  
- **Problema de Carga de la Lista de Pacientes**:  
  - Se corrigió el error en el formulario de creación de citas donde la lista de pacientes no se cargaba correctamente.  =

# Notas de la Versión: Versión 1.2.0

## Nuevas Funcionalidades

- **Generador de Reportes**:  
  Se implementó una función para generar reportes en la página del paciente, permitiendo la creación de archivos PDF con datos de medicación, gráficos de tareas pendientes y estadísticas de tarjetas de aprendizaje.

- **Gráficos ToDoPieChart y FlashcardPieChart**:  
  Se añadieron nuevos gráficos visuales en la página del paciente para una mejor representación de datos.

## Mejoras

- **Manejo de Respuestas de API**:  
  - Implementado **Tostify** para mostrar mensajes de éxito y error en las respuestas de las API.  
  - Mejorado el manejo de errores en las respuestas de las API para proporcionar retroalimentación más clara y útil.

- **Optimización de Obtención de Datos**:  
  Actualizados los mecanismos de obtención de datos en las páginas de **calendario** y **dashboard** para un mejor rendimiento.

- **Responsividad de Gráficos**:  
  Corregidos problemas de responsividad en los gráficos de la página del paciente, garantizando una visualización consistente en diferentes tamaños de pantalla.

## Mejoras Técnicas

- **MedLogService**:  
  Añadido un servicio centralizado para gestionar todas las entradas de **Medication Log**, permitiendo una integración fluida con la función de generación de reportes.

## Seguridad

- **Restricciones por Rol**:  
  Se añadieron restricciones basadas en roles en la página de inicio de sesión para garantizar un control adecuado de acceso.
