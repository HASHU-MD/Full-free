const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.')); // index.html pennanna

const SURGE_TOKEN = "8d0782c6a7e4339562ad73eae80ccf45";

app.post('/deploy', (req, res) => {
    const { subdomain, html } = req.body;
    const domain = `${subdomain}.surge.sh`;
    const folderName = `temp_${Date.now()}`;
    
    // 1. Temporary folder ekak hadanna
    fs.mkdirSync(folderName);
    fs.writeFileSync(path.join(folderName, 'index.html'), html);

    // 2. Surge deploy command eka run karanna
    const cmd = `npx surge ${folderName} --domain ${domain} --token ${SURGE_TOKEN}`;

    exec(cmd, (err, stdout, stderr) => {
        // Folder eka delete karanna
        fs.rmSync(folderName, { recursive: true, force: true });

        if (err) {
            return res.json({ success: false, message: err.message });
        }
        res.json({ success: true, url: `https://${domain}` });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
