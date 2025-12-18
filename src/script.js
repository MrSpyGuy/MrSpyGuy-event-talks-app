document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const scheduleContainer = document.getElementById('schedule');
  const talks = Array.from(scheduleContainer.getElementsByClassName('talk'));

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    talks.forEach(talk => {
      const categories = talk.dataset.category.toLowerCase();
      if (categories.includes(searchTerm)) {
        talk.style.display = '';
      } else {
        talk.style.display = 'none';
      }
    });
  });
});
