const statusButton = document.getElementById('statusButton');
const statusMessage = document.getElementById('statusMessage');

statusButton.addEventListener('click', async () => {
  statusMessage.textContent = 'Checking server and database status...';

  try {
    const response = await fetch('/api/status');
    const result = await response.json();

    if (response.ok) {
      statusMessage.textContent = `✅ ${result.message}`;
    } else {
      statusMessage.textContent = `⚠️ ${result.error || 'Unable to reach API.'}`;
    }
  } catch (error) {
    statusMessage.textContent = `❌ Request failed: ${error.message}`;
  }
});
