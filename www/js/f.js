function toggleCalendar(icon) {
    const calendar = icon.closest('.icons').nextElementSibling;

    // Alterna a visibilidade do calendário
    calendar.classList.toggle('hidden');

    // Alterna o ícone da seta
    if (calendar.classList.contains('hidden')) {
      icon.classList.remove('ri-arrow-up-s-line');
      icon.classList.add('ri-arrow-down-s-line');
    } else {
      icon.classList.remove('ri-arrow-down-s-line');
      icon.classList.add('ri-arrow-up-s-line');
    }
}

