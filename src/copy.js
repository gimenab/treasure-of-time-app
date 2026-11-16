// All app copy in one place (es-AR). Translating later means editing only this file.
export const copy = {
  appName: 'Tu tesoro',
  min: (n) => `+${n} min`,

  notice: {
    title: 'Tus minutos se guardan en este dispositivo',
    body: 'No hay cuenta ni servidor: todo queda en este navegador. Si borrás los datos del navegador o abrís la app en otro dispositivo, no vas a ver lo que llevás.',
    iphoneTip: 'En iPhone: tocá Compartir y después "Agregar a inicio". Si no, Safari puede borrar tus datos después de unos 7 días sin abrir la app.',
    ok: 'Entendido',
  },

  setup: {
    title: 'Elegí tus tareas',
    intro: 'Marcá las que quieras hacer y cuándo se repiten. Podés cambiarlas más adelante.',
    categories: {
      health: 'Salud · Cuidarme',
      home: 'Hogar · Sostener mi espacio',
      work: 'Trabajo / Propósito',
    },
    repeat: {
      daily: 'Todos los días',
      days: 'Algunos días',
      once: 'Una vez',
    },
    onceDate: 'Qué día',
    pickDays: 'Elegí al menos un día',
    customTitle: 'Una tarea tuya',
    customHint: 'Una rutina que no está en la lista.',
    customPlaceholder: 'Por ejemplo: regar las plantas',
    customAdd: 'Agregar',
    customMinutes: 'Cuánto vale',
    remove: 'Quitar',
    done: 'Listo',
    doneDisabled: 'Elegí al menos una tarea',
  },

  tasks: {
    water: 'Tomar agua',
    meds: 'Tomar la medicación',
    pause: 'Pausa consciente (5 min)',
    walk: 'Caminar 15 min',
    bed: 'Hacer la cama',
    dishes: 'Lavar los platos',
    cook: 'Cocinar algo simple',
    pending: 'Responder pendientes',
    focus: 'Bloque de foco (25 min)',
    study: 'Estudiar (30 min)',
  },

  // Monday first; index = JS getDay() value.
  weekdays: [
    { day: 1, short: 'Lu' },
    { day: 2, short: 'Ma' },
    { day: 3, short: 'Mi' },
    { day: 4, short: 'Ju' },
    { day: 5, short: 'Vi' },
    { day: 6, short: 'Sá' },
    { day: 0, short: 'Do' },
  ],

  home: {
    treasure: 'Tu tesoro',
    minutes: (n) => `${n} min`,
  },

  today: {
    title: 'Hoy',
    empty: 'Hoy no tenés tareas programadas.',
    bonusHint: (n) => `Si completás todo lo de hoy, sumás +${n} min.`,
    bonusEarned: (n) => `Completaste todo lo de hoy: +${n} min.`,
    undo: 'Deshacer',
    difficultTitle: 'Una tarea difícil',
    difficultHint: (n) => `Opcional. Algo que te cueste, con tus palabras. Vale +${n} min.`,
    difficultMore: 'Agregar otra',
    difficultPlaceholder: 'Por ejemplo: llamar al banco',
    difficultAdd: 'Agregar',
    difficultBadge: 'Difícil',
    remove: 'Quitar',
    yesterday: (title) => `Ayer: ${title}`,
    addAgain: 'Agregar de nuevo',
  },
}
