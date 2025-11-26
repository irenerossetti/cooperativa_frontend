# 🤖 Chatbot Agrícola Inteligente - Implementado

## ✅ Funcionalidades Implementadas

### 1. Botón Flotante
- ✅ Botón flotante en la esquina inferior derecha
- ✅ Animación de pulso para llamar la atención
- ✅ Indicador de notificación (punto rojo)
- ✅ Diseño moderno con gradientes

### 2. Ventana de Chat
- ✅ Interfaz moderna con backdrop blur
- ✅ Header con información del asistente
- ✅ Indicador de estado "En línea"
- ✅ Botón para reiniciar conversación
- ✅ Botón para cerrar chat

### 3. Mensajes Rápidos
- ✅ Botones de preguntas frecuentes
- ✅ Se muestran al inicio de la conversación
- ✅ Envío automático al hacer clic

### 4. Sistema de Mensajes
- ✅ Mensajes del usuario (derecha, verde)
- ✅ Mensajes del bot (izquierda, blanco)
- ✅ Timestamps en cada mensaje
- ✅ Scroll automático al final
- ✅ Animaciones de entrada

### 5. Indicador de Escritura
- ✅ Muestra "Escribiendo..." cuando el bot está procesando
- ✅ Animación de spinner
- ✅ Deshabilita input mientras procesa

### 6. Backend Inteligente
- ✅ Extracción automática de información (nombre, edad, cultivos)
- ✅ Respuestas contextuales
- ✅ Almacenamiento de conversaciones en BD
- ✅ Historial de mensajes
- ✅ Multi-tenancy (por organización)

## 📊 Respuestas Inteligentes

El chatbot puede responder sobre:

### 🏦 Créditos Agrícolas
- Crédito para insumos (hasta $50,000)
- Crédito para maquinaria (hasta $200,000)
- Crédito de campaña (hasta $100,000)
- Requisitos y tasas

### 🌱 Semillas Certificadas
- Maíz híbrido
- Soja certificada
- Trigo premium
- Papa semilla
- Precios y beneficios

### 👨‍🌾 Asesoría Técnica
- Planificación de cultivos
- Manejo integrado de plagas
- Fertilización
- Riego y drenaje

### 📝 Afiliación
- Beneficios de ser socio
- Requisitos
- Cuotas
- Proceso de inscripción

### 📦 Productos y Servicios
- Insumos agrícolas
- Servicios disponibles
- Beneficios adicionales

## 🎯 Cómo Usar

### Para el Usuario Final:

1. **Abrir el chat:**
   - Haz clic en el botón flotante verde en la esquina inferior derecha

2. **Usar mensajes rápidos:**
   - Haz clic en cualquiera de los botones de preguntas frecuentes

3. **Escribir mensaje:**
   - Escribe tu pregunta en el campo de texto
   - Presiona Enter o haz clic en el botón de enviar

4. **Reiniciar conversación:**
   - Haz clic en el ícono de reiniciar en el header

5. **Cerrar chat:**
   - Haz clic en la X en el header

### Ejemplos de Conversación:

```
Usuario: Hola, me llamo Juan Pérez
Bot: ¡Hola Juan! Bienvenido...

Usuario: Tengo 45 años y cultivo maíz
Bot: Mucho gusto, Juan. Para poder ofrecerte mejor asesoría...

Usuario: Necesito información sobre créditos
Bot: 🏦 Créditos Agrícolas Disponibles:
     [Muestra información detallada]

Usuario: ¿Qué semillas tienen?
Bot: 🌱 Semillas Certificadas Disponibles...
```

## 🔧 Endpoints del Backend

### 1. Enviar Mensaje
```
POST /api/chatbot/api/
Authorization: Bearer {token}

Body:
{
  "message": "Hola, necesito información",
  "cliente_id": "user_123"
}

Response:
{
  "response": "¡Hola! Bienvenido...",
  "cliente_id": "user_123",
  "conversation_id": 1
}
```

### 2. Obtener Historial
```
GET /api/chatbot/historial/{cliente_id}/
Authorization: Bearer {token}

Response:
{
  "cliente_id": "user_123",
  "historial": {
    "nombre": "Juan Pérez",
    "edad": 45,
    "tipo_cultivo": "maíz",
    "necesidad_principal": "credito",
    "fase": "recomendacion",
    "interaccion": [...],
    "respuestas_bot": [...],
    "total_mensajes": 10
  }
}
```

### 3. Limpiar Historial
```
POST /api/chatbot/limpiar/{cliente_id}/
Authorization: Bearer {token}

Response:
{
  "mensaje": "Historial limpiado para cliente user_123",
  "cliente_id": "user_123",
  "conversaciones_eliminadas": 1
}
```

## 📁 Archivos Creados

### Frontend:
- `Frontend/src/components/Chatbot.jsx` - Componente principal del chatbot

### Backend:
- `Backend/chatbot/models.py` - Modelos de BD
- `Backend/chatbot/views.py` - Vistas/endpoints
- `Backend/chatbot/chatbot_engine.py` - Motor de respuestas inteligentes
- `Backend/chatbot/urls.py` - URLs
- `Backend/chatbot/admin.py` - Panel de administración

## 🎨 Diseño

### Colores:
- **Primario:** Emerald (verde cooperativa)
- **Fondo:** Gray-900 con blur
- **Usuario:** Emerald-500/600
- **Bot:** White/10 con blur

### Animaciones:
- Fade in al aparecer mensajes
- Slide in desde abajo
- Pulse en el botón flotante
- Spin en el loader

## 🚀 Próximas Mejoras

- [ ] Integración con WhatsApp Business API
- [ ] Soporte de voz (speech-to-text)
- [ ] Envío de imágenes
- [ ] Sugerencias automáticas mientras escribes
- [ ] Traducción a quechua/guaraní
- [ ] Análisis de sentimientos
- [ ] Recomendaciones basadas en ubicación
- [ ] Integración con sistema de tickets
- [ ] Notificaciones push
- [ ] Exportar conversación a PDF

## 💡 Notas Técnicas

- El chatbot requiere autenticación (token JWT)
- Cada usuario tiene un `cliente_id` único generado automáticamente
- Las conversaciones se almacenan por organización (multi-tenancy)
- El motor de respuestas extrae información automáticamente del texto
- Las respuestas son contextuales basadas en el historial

## 🧪 Cómo Probar

1. **Inicia sesión en la aplicación**
2. **Haz clic en el botón flotante verde**
3. **Prueba estos mensajes:**
   - "Hola, me llamo [tu nombre]"
   - "Tengo [edad] años y cultivo [cultivo]"
   - "Necesito información sobre créditos"
   - "¿Qué semillas tienen disponibles?"
   - "Quiero afiliarme a la cooperativa"

## 📊 Base de Datos

### Tabla: chatbot_conversations
- `id`: ID único
- `organization_id`: Organización (multi-tenancy)
- `cliente_id`: ID del cliente
- `nombre`: Nombre extraído
- `edad`: Edad extraída
- `tipo_cultivo`: Cultivo mencionado
- `necesidad_principal`: Necesidad detectada
- `fase`: Fase de la conversación
- `tono`: Tono emocional
- `nivel_interes`: Nivel de interés
- `created_at`: Fecha de creación
- `updated_at`: Última actualización

### Tabla: chatbot_messages
- `id`: ID único
- `conversation_id`: Conversación relacionada
- `message_type`: 'user' o 'bot'
- `content`: Contenido del mensaje
- `timestamp`: Fecha y hora

## ✅ Estado Actual

**Chatbot: 100% Funcional** 🎉
- Frontend implementado ✅
- Backend implementado ✅
- Base de datos configurada ✅
- Respuestas inteligentes ✅
- Multi-tenancy ✅
- Historial de conversaciones ✅

¡El chatbot está listo para usar en producción!
