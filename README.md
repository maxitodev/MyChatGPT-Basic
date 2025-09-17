# ChatAI - Asistente con OpenAI

Una aplicación de chat moderna construida con Next.js que utiliza la API de OpenAI para proporcionar respuestas inteligentes al estilo ChatGPT.

## 🚀 Características

- 💬 **Chat en tiempo real** con streaming de respuestas
- 🔑 **Configuración segura** de API key (almacenada localmente)
- 🎨 **Interfaz moderna** inspirada en ChatGPT
- 📱 **Diseño responsive** para dispositivos móviles y desktop
- 🌙 **Tema oscuro** optimizado para una mejor experiencia
- 📋 **Copiar mensajes** con un solo clic
- ⚡ **Respuestas en streaming** para una experiencia fluida
- 🛡️ **Manejo de errores** robusto

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **API**: OpenAI GPT-3.5-turbo
- **Iconos**: Lucide React
- **Notificaciones**: Sonner

## 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/maxitodev/MyChatGPT-Basic.git
   cd MyChatGPT-Basic
   ```

2. **Instala las dependencias**
   ```bash
   pnpm install
   # o
   npm install
   # o
   yarn install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   pnpm dev
   # o
   npm run dev
   # o
   yarn dev
   ```

4. **Abre tu navegador**
   
   Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 🔧 Configuración

### API Key de OpenAI

1. **Obtén tu API key**
   - Visita [OpenAI Platform](https://platform.openai.com/api-keys)
   - Crea una cuenta o inicia sesión
   - Genera una nueva API key

2. **Configura en la aplicación**
   - Abre la aplicación
   - Haz clic en "Configuración API" en la barra lateral
   - Ingresa tu API key (se guarda localmente en tu navegador)
   - ¡Comienza a chatear!

### Variables de Entorno (Opcional)

Si prefieres usar variables de entorno en lugar de configurar la API key en la interfaz:

```bash
# .env.local
OPENAI_API_KEY=tu_api_key_aqui
```

## 🎯 Uso

1. **Configura tu API key** usando el botón "Configuración API"
2. **Escribe tu mensaje** en el campo de texto
3. **Presiona Enter** o haz clic en el botón de enviar
4. **Disfruta** de las respuestas en tiempo real del asistente de IA

### Atajos de Teclado

- `Enter`: Enviar mensaje
- `Shift + Enter`: Nueva línea en el mensaje

## 📁 Estructura del Proyecto

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API route para OpenAI
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página principal
├── components/
│   ├── ui/                      # Componentes de UI (Radix)
│   ├── api-key-config.tsx       # Configuración de API key
│   ├── chat-interface.tsx       # Interfaz principal del chat
│   └── theme-provider.tsx       # Proveedor de tema
├── hooks/
│   ├── use-chat.ts              # Hook personalizado para chat
│   ├── use-mobile.ts            # Hook para detección móvil
│   └── use-toast.ts             # Hook para notificaciones
├── lib/
│   └── utils.ts                 # Utilidades
└── public/                      # Archivos estáticos
```

## 🔒 Seguridad

- **API Key Local**: Tu API key se almacena únicamente en el localStorage de tu navegador
- **Sin Backend**: No almacenamos tu API key en ningún servidor
- **Comunicación Directa**: Las llamadas van directamente de tu navegador a OpenAI
- **HTTPS**: Todas las comunicaciones están encriptadas

## 🎨 Personalización

### Cambiar el Modelo de IA

Edita el archivo `app/api/chat/route.ts`:

```typescript
const stream = await openai.chat.completions.create({
  model: 'gpt-4', // Cambia aquí el modelo
  // ...resto de la configuración
})
```

### Personalizar el Prompt del Sistema

En el mismo archivo, modifica el mensaje del sistema:

```typescript
{
  role: 'system',
  content: 'Tu prompt personalizado aquí...'
}
```

### Temas y Estilos

Los estilos están en `app/globals.css` usando variables CSS personalizadas que puedes modificar.

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conecta tu repositorio** a Vercel
2. **Configura las variables de entorno** (opcional)
3. **Despliega** automáticamente

### Otros Proveedores

La aplicación es compatible con cualquier proveedor que soporte Next.js:
- Netlify
- Railway
- Render
- Docker

## 🐛 Solución de Problemas

### Error: "Invalid API key"
- Verifica que tu API key sea correcta
- Asegúrate de que la API key tenga créditos disponibles

### Error: "Rate limit exceeded"
- Has excedido el límite de solicitudes de OpenAI
- Espera unos minutos antes de volver a intentar

### La aplicación no carga
- Verifica que todas las dependencias estén instaladas
- Ejecuta `pnpm install` nuevamente

## 🤝 Contribuir

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abre** un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [OpenAI](https://openai.com) por su increíble API
- [Vercel](https://vercel.com) por Next.js
- [Radix UI](https://radix-ui.com) por los componentes de UI
- [Tailwind CSS](https://tailwindcss.com) por el sistema de diseño

## 📞 Soporte

Si tienes alguna pregunta o problema:

- 🐛 [Reportar un bug](https://github.com/maxitodev/MyChatGPT-Basic/issues)
- 💡 [Solicitar una funcionalidad](https://github.com/maxitodev/MyChatGPT-Basic/issues)
- 📧 Contacto: [tu-email@example.com]

---

⭐ Si te gusta este proyecto, ¡no olvides darle una estrella!