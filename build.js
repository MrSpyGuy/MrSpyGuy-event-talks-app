const fs = require('fs').promises;
const path = require('path');

async function build() {
  try {
    // Create dist directory if it doesn't exist
    await fs.mkdir('dist', { recursive: true });

    // Read source files
    const talksData = await fs.readFile('src/talks.json', 'utf8');
    const talks = JSON.parse(talksData);
    const css = await fs.readFile('src/style.css', 'utf8');
    const js = await fs.readFile('src/script.js', 'utf8');
    const template = await fs.readFile('src/template.html', 'utf8');

    // Generate schedule HTML
    let scheduleHtml = '';
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0);

    const formatTime = (date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    talks.forEach((talk, index) => {
      const startTime = new Date(currentTime);
      const endTime = new Date(startTime.getTime() + talk.duration * 60000);

      scheduleHtml += `
        <div class="talk" data-category="${talk.category.join(', ')}">
          <div class="details">
            <span>${formatTime(startTime)} - ${formatTime(endTime)}</span>
            <span>${talk.speakers.join(', ')}</span>
          </div>
          <h2>${talk.title}</h2>
          <p class="category">Category: ${talk.category.join(', ')}</p>
          <p>${talk.description}</p>
        </div>
      `;

      currentTime = new Date(endTime.getTime() + 10 * 60000);

      if (index === 2) {
        const lunchStartTime = new Date(currentTime);
        const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60000);
        scheduleHtml += `
          <div class="break">
            <span>${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</span>
            <p>Lunch Break</p>
          </div>
        `;
        currentTime = new Date(lunchEndTime.getTime() + 10 * 60000);
      }
    });

    // Inject content into template
    let finalHtml = template.replace('/* CSS will be injected here */', css);
    finalHtml = finalHtml.replace('// JavaScript will be injected here', js);
    finalHtml = finalHtml.replace('<!-- Schedule will be injected here -->', scheduleHtml);

    // Write final HTML file
    await fs.writeFile('dist/index.html', finalHtml);
    console.log('Successfully generated dist/index.html');

  } catch (error) {
    console.error('Error building the website:', error);
  }
}

build();
