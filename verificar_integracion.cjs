#!/usr/bin/env node

/**
 * Script de verificación de integración del frontend
 * Verifica que todas las nuevas funcionalidades estén correctamente integradas
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando integración de nuevas funcionalidades...\n');

const checks = {
  passed: [],
  failed: []
};

// 1. Verificar que existan los archivos de páginas
console.log('📄 Verificando archivos de páginas...');
const pages = [
  'src/pages/NotificationsPage.jsx',
  'src/pages/DashboardRealTime.jsx',
  'src/pages/AIChat.jsx',
  'src/pages/EventsCalendar.jsx',
  'src/pages/GoalsPage.jsx'
];

pages.forEach(page => {
  if (fs.existsSync(path.join(__dirname, page))) {
    checks.passed.push(`✅ ${page} existe`);
  } else {
    checks.failed.push(`❌ ${page} NO existe`);
  }
});

// 2. Verificar componentes
console.log('\n🧩 Verificando componentes...');
const components = [
  'src/components/notifications/NotificationBell.jsx',
  'src/components/qr/QRCodeModal.jsx'
];

components.forEach(comp => {
  if (fs.existsSync(path.join(__dirname, comp))) {
    checks.passed.push(`✅ ${comp} existe`);
  } else {
    checks.failed.push(`❌ ${comp} NO existe`);
  }
});

// 3. Verificar App.jsx
console.log('\n🔗 Verificando rutas en App.jsx...');
const appContent = fs.readFileSync(path.join(__dirname, 'src/App.jsx'), 'utf8');

const routes = [
  'NotificationsPage',
  'DashboardRealTime',
  'AIChat',
  'EventsCalendar',
  'GoalsPage'
];

routes.forEach(route => {
  if (appContent.includes(`import ${route}`)) {
    checks.passed.push(`✅ ${route} importado en App.jsx`);
  } else {
    checks.failed.push(`❌ ${route} NO importado en App.jsx`);
  }
  
  if (appContent.includes(`<${route}`)) {
    checks.passed.push(`✅ Ruta de ${route} configurada`);
  } else {
    checks.failed.push(`❌ Ruta de ${route} NO configurada`);
  }
});

// 4. Verificar Sidebar.jsx
console.log('\n📋 Verificando menú en Sidebar.jsx...');
const sidebarContent = fs.readFileSync(path.join(__dirname, 'src/components/layout/Sidebar.jsx'), 'utf8');

const menuItems = [
  { path: '/notifications', label: 'Notificaciones' },
  { path: '/dashboard-realtime', label: 'Dashboard Tiempo Real' },
  { path: '/ai-chat', label: 'Asistente IA' },
  { path: '/events', label: 'Eventos' },
  { path: '/goals', label: 'Metas' }
];

menuItems.forEach(item => {
  if (sidebarContent.includes(item.path)) {
    checks.passed.push(`✅ Menú "${item.label}" configurado`);
  } else {
    checks.failed.push(`❌ Menú "${item.label}" NO configurado`);
  }
});

// 5. Verificar iconos en Sidebar
const icons = ['Bell', 'Activity', 'MessageSquare', 'Target'];
icons.forEach(icon => {
  if (sidebarContent.includes(icon)) {
    checks.passed.push(`✅ Icono ${icon} importado`);
  } else {
    checks.failed.push(`❌ Icono ${icon} NO importado`);
  }
});

// 6. Verificar NotificationBell en Navbar
console.log('\n🔔 Verificando NotificationBell en Navbar...');
const navbarContent = fs.readFileSync(path.join(__dirname, 'src/components/layout/Navbar.jsx'), 'utf8');

if (navbarContent.includes('import NotificationBell')) {
  checks.passed.push('✅ NotificationBell importado en Navbar');
} else {
  checks.failed.push('❌ NotificationBell NO importado en Navbar');
}

if (navbarContent.includes('<NotificationBell')) {
  checks.passed.push('✅ NotificationBell usado en Navbar');
} else {
  checks.failed.push('❌ NotificationBell NO usado en Navbar');
}

// Resumen
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(60));

console.log(`\n✅ Verificaciones exitosas: ${checks.passed.length}`);
checks.passed.forEach(check => console.log(`   ${check}`));

if (checks.failed.length > 0) {
  console.log(`\n❌ Verificaciones fallidas: ${checks.failed.length}`);
  checks.failed.forEach(check => console.log(`   ${check}`));
  console.log('\n⚠️  Hay problemas que necesitan ser corregidos.');
  process.exit(1);
} else {
  console.log('\n🎉 ¡Todas las verificaciones pasaron exitosamente!');
  console.log('\n📝 Próximos pasos:');
  console.log('   1. Ejecuta: npm run dev');
  console.log('   2. Accede a: http://localhost:5173');
  console.log('   3. Verifica que las nuevas páginas sean accesibles desde el menú');
  console.log('   4. Prueba cada funcionalidad');
  process.exit(0);
}
