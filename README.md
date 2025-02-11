# Focused Back-Office Web

Este repositorio corresponde al Back-office para profesionales y administradores. Los profesionales pueden monitorear el progreso de sus pacientes, analizar datos y ajustar tratamientos. Los administradores pueden gestionar usuarios, desactivar cuentas, visualizar detalles de psicólogos, psiquiatras y pacientes, y ver el tiempo de uso de la aplicación por cada usuario.

## Características de Profesionales

- Visualizar perfil del psicólogo/psiquiatra.
- Visualizar el horario con las citas de los pacientes.
- Agendar citas de los pacientes.
- Acceder al listado de pacientes.
- Visualizar estadística/reporte de los pacientes.
- Registrar medicación al paciente. (SOLO PARA EL PSIQUIATRA)

## Características de Administrador

- Agregar, editar y eliminar usuarios.
- Asignar roles y permisos a los usuarios
- Generar y visualizar reportes detallados sobre el uso de la aplicación.
- Permitir la creación, edición y eliminación de contenidos dentro de la aplicación.

## Notas de la versión

### Última versión (1.1.0)

- **🆕 Nuevas Funcionalidades**
  - **Generador de Reportes**: Generación de reportes en PDF en la página del paciente.  
  - **Gráficos**: Añadidos ToDoPieChart y FlashcardPieChart para una mejor visualización de datos.
  - **Restricciones por Rol**: Implementadas en la página de inicio de sesión.
  - **MedLogService**: Servicio centralizado para gestionar Medication Logs.

- **🔧 Actualizaciones Técnicas**  
  - **API**: Implementado Tostify y mejorado manejo de errores.  
  - **Obtención de Datos**: Optimizada en calendario y dashboard.  
  - **Gráficos**: Corregida responsividad en la página del paciente.

- **🐛 Corrección de Errores**  
  - Nada

Para detalles completos de cada versión, consulta la [sección de Releases](https://dev.azure.com/INTEC-IDS352-02-2024-02-Equipo-5/Focused/_git/Focused_BackOffice?path=/Releases.md).

## Instalación

1. **Clone the repository**

```bash
git clone https://INTEC-IDS352-02-2024-02-Equipo-5@dev.azure.com/INTEC-IDS352-02-2024-02-Equipo-5/Focused/_git/Focused_BackOffice
```

2. **Navigate to the project directory**

```bash
cd focused-backoffice
```

3. **Install dependencies**

```bash
npm install
```

4. **Run the development server**

```bash
npm run dev
```

El proyecto estará disponible en http://localhost:3000.