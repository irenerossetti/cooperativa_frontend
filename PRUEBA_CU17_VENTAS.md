# Prueba de Caso de Uso CU17: Gestionar Ventas/Pedidos de Clientes

## Descripción
Este caso de uso permite registrar pedidos de compra de la producción agrícola de la cooperativa, asociando un cliente, los productos de campaña (cultivo, variedad), cantidades, precios y estado del pedido (Pendiente, Confirmado, Entregado, Cancelado). Los pedidos registrados sirven de base para la planificación de entregas, la actualización de inventario y el registro de pagos posteriores.

## Precondiciones
- ✅ a) El usuario debe tener sesión iniciada con un rol autorizado en el módulo de Comercialización
- ✅ b) Deben existir clientes compradores registrados y activos
- ✅ c) Deben existir productos agrícolas (cosechas) con stock disponible asociados a campañas
- ✅ d) Debe existir conexión activa con la base de datos

## Pasos de Prueba

| Paso | Acción | Resultado Esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Acceder al módulo "Ventas / Pedidos" desde el menú principal | Se muestra la lista de pedidos registrados con sus datos principales (Nro, Cliente, Fecha, Total, Estado) | ⬜ Pendiente |
| 2 | Hacer clic en "Nuevo pedido" | Se despliega el formulario de creación de pedido con campos para cliente, productos, cantidades, precios y fecha de entrega | ⬜ Pendiente |
| 3 | Seleccionar un cliente activo y agregar un producto agrícola con cantidad menor o igual al stock disponible | El sistema acepta la selección, muestra el precio unitario, calcula el subtotal y el total del pedido sin errores | ⬜ Pendiente |
| 4 | Guardar el pedido | El sistema registra el pedido en estado "Borrador" y muestra mensaje de confirmación | ⬜ Pendiente |
| 5 | Editar el pedido creado y cambiar el estado a "Confirmado" | El sistema valida el estado anterior, actualiza el pedido a "Confirmado" y registra usuario/fecha de la confirmación | ⬜ Pendiente |
| 6 | Cambiar el estado del pedido de "Confirmado" a "Entregado" | El sistema actualiza el estado a "Entregado" y descuenta del inventario la cantidad de productos vendidos | ⬜ Pendiente |
| 7 | Intentar crear un nuevo pedido con cantidad mayor al stock disponible de un producto | El sistema no permite guardar el pedido y muestra un mensaje de error indicando stock insuficiente | ⬜ Pendiente |
| 8 | Intentar crear un pedido sin seleccionar cliente | El sistema no guarda el pedido y muestra un mensaje que indica que el campo Cliente es obligatorio | ⬜ Pendiente |

## Responsable
Administrador Módulo de Ventas

## Resultado de la Prueba
⬜ Satisfactorio
⬜ Fallido

## Funcionalidades Implementadas

### 1. Lista de Pedidos
- ✅ Visualización de todos los pedidos con:
  - Número de pedido
  - Cliente
  - Fecha
  - Total
  - Estado (con colores distintivos)
- ✅ Búsqueda por número de pedido o nombre de cliente
- ✅ Filtro por estado (Borrador, Confirmado, Pagado, Enviado, Entregado, Cancelado)

### 2. Crear Nuevo Pedido
- ✅ Formulario con campos obligatorios:
  - Cliente (obligatorio)
  - Campaña (obligatorio)
  - Fecha de pedido (obligatorio)
  - Fecha de entrega (opcional)
- ✅ Agregar múltiples productos al pedido
- ✅ Selección de producto con visualización de stock disponible
- ✅ Ingreso de cantidad y precio unitario
- ✅ Cálculo automático del total
- ✅ Validación de stock antes de guardar
- ✅ Validación de campos obligatorios

### 3. Editar Pedido
- ✅ Solo se pueden editar pedidos en estado "Borrador"
- ✅ Modificación de datos del pedido
- ✅ Agregar/eliminar productos

### 4. Ver Detalles del Pedido
- ✅ Visualización completa de:
  - Información del pedido
  - Lista de productos con cantidades y precios
  - Total del pedido

### 5. Gestión de Estados
- ✅ Cambio de estado "Borrador" → "Confirmado"
- ✅ Cambio de estado "Confirmado" → "Entregado"
- ✅ Descuento automático de inventario al marcar como "Entregado"
- ✅ Validación de stock al confirmar pedido

### 6. Eliminar Pedido
- ✅ Solo se pueden eliminar pedidos en estado "Borrador" o "Cancelado"
- ✅ Confirmación antes de eliminar

## Validaciones Implementadas

1. **Validación de Cliente Obligatorio**
   - El sistema no permite guardar un pedido sin seleccionar un cliente
   - Mensaje: "El campo Cliente es obligatorio"

2. **Validación de Stock**
   - Al agregar productos, se muestra el stock disponible
   - Al guardar, se valida que la cantidad no exceda el stock
   - Mensaje: "Stock insuficiente para [Producto]. Disponible: [cantidad]"

3. **Validación de Productos**
   - Debe haber al menos un producto en el pedido
   - Mensaje: "Debe agregar al menos un producto"

4. **Validación de Estados**
   - Solo pedidos en "Borrador" pueden ser editados
   - Solo pedidos en "Borrador" pueden ser confirmados
   - Solo pedidos en "Confirmado" pueden ser marcados como entregados

## Endpoints API Utilizados

- `GET /api/sales/orders/` - Listar pedidos
- `POST /api/sales/orders/` - Crear pedido
- `GET /api/sales/orders/{id}/` - Obtener detalle de pedido
- `PUT /api/sales/orders/{id}/` - Actualizar pedido
- `PATCH /api/sales/orders/{id}/` - Actualizar parcialmente (cambio de estado)
- `DELETE /api/sales/orders/{id}/` - Eliminar pedido
- `POST /api/sales/order-items/` - Agregar item al pedido
- `GET /api/sales/customers/` - Listar clientes
- `GET /api/campaigns/` - Listar campañas
- `GET /api/production/harvested-products/` - Listar productos cosechados

## Datos de Prueba Creados

### Clientes
1. Juan Pérez García (CI: 7654321)
2. María López Mamani (CI: 8765432)
3. Empresa Agrícola S.R.L. (NIT: 1234567890)

### Pedidos de Ejemplo
1. ORD-TEST-20251123-001 - Estado: Borrador
2. ORD-TEST-20251123-002 - Estado: Confirmado
3. ORD-TEST-20251123-003 - Estado: Entregado

## Instrucciones para Ejecutar las Pruebas

1. **Preparar datos de prueba:**
   ```bash
   cd Backend
   python create_test_products.py
   python create_test_sales.py
   ```

2. **Iniciar el servidor backend:**
   ```bash
   python manage.py runserver
   ```

3. **Iniciar el frontend:**
   ```bash
   cd Frontend
   npm run dev
   ```

4. **Acceder al sistema:**
   - URL: http://localhost:5173
   - Usuario: admin
   - Contraseña: admin123

5. **Navegar al módulo:**
   - Ir al menú lateral
   - Hacer clic en "Ventas / Pedidos"

6. **Ejecutar los pasos de prueba** según la tabla anterior

## Notas Adicionales

- El módulo está completamente funcional y listo para pruebas
- Todas las validaciones están implementadas
- La interfaz es responsive y funciona en dispositivos móviles
- Los cambios de estado se registran correctamente
- El descuento de inventario se realiza automáticamente al marcar como "Entregado"

## Capturas de Pantalla Sugeridas

1. Lista de pedidos con filtros
2. Formulario de nuevo pedido
3. Selección de productos con stock
4. Validación de stock insuficiente
5. Validación de cliente obligatorio
6. Detalle de pedido
7. Cambio de estado a Confirmado
8. Cambio de estado a Entregado
