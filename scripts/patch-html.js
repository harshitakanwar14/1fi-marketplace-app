const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Inject error overlay script before </body>
const errorOverlay = `
<script>
  window.addEventListener('error', function(e) {
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;top:0;left:0;right:0;padding:20px;background:#fff;color:red;font-family:monospace;font-size:13px;z-index:999999;overflow:auto;max-height:50vh;';
    d.textContent = 'ERROR: ' + e.message + '\\n' + (e.error ? e.error.stack : '');
    document.body.appendChild(d);
  });
</script>`;

html = html.replace('</body>', errorOverlay + '\n</body>');
fs.writeFileSync(indexPath, html);
console.log('index.html patched with error overlay');
