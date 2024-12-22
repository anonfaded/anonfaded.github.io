// Initialize Matrix Rain
const matrixCanvas = document.getElementById('matrix-rain');
new MatrixRain(matrixCanvas);

// Hack statistics
let startTime = Date.now();
let encryptedFiles = 0;
let backdoors = 0;

function updateHackStats() {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    document.getElementById('timeElapsed').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (Math.random() < 0.1) {
        encryptedFiles += Math.floor(Math.random() * 5);
        document.getElementById('encryptedCount').textContent = encryptedFiles;
    }
    
    if (Math.random() < 0.05) {
        backdoors++;
        document.getElementById('backdoorCount').textContent = backdoors;
    }
}

// System info collection with more detailed information
async function getSystemInfo() {
    const browserInfo = {
        name: navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)[1],
        version: navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)[2],
        language: navigator.language,
        platform: navigator.platform,
        cores: navigator.hardwareConcurrency || 'N/A',
        memory: navigator.deviceMemory ? navigator.deviceMemory + 'GB' : 'N/A',
        connection: navigator.connection ? navigator.connection.effectiveType : 'N/A'
    };

    const screenInfo = {
        resolution: `${window.screen.width}x${window.screen.height}`,
        colorDepth: window.screen.colorDepth + ' bits',
        orientation: screen.orientation.type,
        pixelRatio: window.devicePixelRatio
    };

    document.getElementById('browserInfo').textContent = `${browserInfo.name} ${browserInfo.version}`;
    document.getElementById('screenInfo').textContent = screenInfo.resolution;
    document.getElementById('osInfo').textContent = `${browserInfo.platform} | ${browserInfo.cores} Cores`;

    try {
        const batteryInfo = await navigator.getBattery();
        const batteryLevel = Math.floor(batteryInfo.level * 100);
        document.getElementById('osInfo').textContent += ` | ${batteryLevel}% Battery`;
    } catch (e) {
        console.log('Battery info not available');
    }

    try {
        const [ipResponse, locationResponse] = await Promise.all([
            fetch('https://api.ipify.org?format=json'),
            fetch('https://ipapi.co/json/')
        ]);
        
        const ipData = await ipResponse.json();
        const locationData = await locationResponse.json();
        
        const maskedIP = ipData.ip.split('.').map((octet, i) => i < 2 ? '**' : octet).join('.');
        document.getElementById('ipAddress').textContent = maskedIP;
        addToTerminal(`[!] Target Location: ${locationData.city}, ${locationData.region}, ${locationData.country_name} [REDACTED]`, 'warning');
    } catch (e) {
        document.getElementById('ipAddress').textContent = '**.**.**.***';
    }
}

// Terminal handling with process logging
const terminalOutput = document.getElementById('terminalOutput');
const progressBar = document.getElementById('mainProgress');
const progressStatus = document.getElementById('progressStatus');
const processLog = document.getElementById('processLog');

function addProcessLog(text) {
    const log = document.createElement('div');
    log.className = 'process-item';
    log.innerHTML = `[${new Date().toLocaleTimeString()}] ${text}`;
    processLog.appendChild(log);
    processLog.scrollTop = processLog.scrollHeight;
}

function addToTerminal(text, type = 'command', delay = 0) {
    return new Promise(resolve => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = `terminal-line ${type}`;
            
            if (type === 'command') {
                const prompt = document.createElement('span');
                prompt.className = 'prompt';
                prompt.textContent = 'faded0x99@target:~# ';
                line.appendChild(prompt);
            }
            
            const content = document.createElement('span');
            content.className = 'content';
            line.appendChild(content);
            terminalOutput.appendChild(line);
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    content.textContent += text[i];
                    i++;
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                } else {
                    clearInterval(typeInterval);
                    resolve();
                }
            }, 10);
        }, delay);
    });
}

// Simulated hacking process with more realistic commands
const hackingProcess = [
    { 
        command: 'nmap -sS -sV -Pn --top-ports 1000 target_system',
        output: 'Starting Nmap scan...\nDiscovered open ports:\n- 22/tcp (SSH)\n- 80/tcp (HTTP)\n- 443/tcp (HTTPS)\n- 3306/tcp (MySQL)',
        processLog: 'Scanning target system ports...',
        delay: 2000 
    },
    { 
        command: 'dirb http://target_system',
        output: 'Discovering hidden directories...\nFound:\n/admin\n/backup\n/config\n/uploads [Vulnerable]',
        processLog: 'Enumerating web directories...',
        delay: 1500 
    },
    { 
        command: 'sqlmap --url target_system/uploads --dbs --batch',
        output: 'Testing SQL injection...\nVulnerable endpoints found!\nDatabases discovered:\n[*] information_schema\n[*] users_db\n[*] admin_panel',
        processLog: 'Testing for SQL vulnerabilities...',
        delay: 2000 
    },
    { 
        command: 'hydra -L users.txt -P rockyou.txt ssh://target',
        output: 'Starting password brute force...\n[22][ssh] host: target   login: admin   password: admin123',
        processLog: 'Brute forcing SSH credentials...',
        delay: 2500 
    },
    { 
        command: 'msfconsole -q -x "use exploit/unix/webapp/wp_admin_shell_upload"',
        output: 'Metasploit Framework initialized...\nExploiting WordPress vulnerability...\nMeterpreter session 1 opened!',
        processLog: 'Deploying exploit payload...',
        delay: 1800 
    },
    { 
        command: 'whoami && id',
        output: 'root\nuid=0(root) gid=0(root) groups=0(root)',
        processLog: 'Escalating privileges...',
        delay: 1000 
    },
    { 
        command: './encrypt_files.sh /var/www/',
        output: 'Encrypting system files...\nBackdoor installed at /etc/cron.d/maintenance\nPersistence achieved.',
        processLog: 'Establishing persistence...',
        delay: 1500 
    }
];

let currentProgress = 0;
const progressIncrement = 100 / hackingProcess.length;

async function simulateHacking() {
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    
    addProcessLog('Initializing attack sequence...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    container.style.opacity = '1';

    for (let i = 0; i < hackingProcess.length; i++) {
        const step = hackingProcess[i];
        addProcessLog(step.processLog);
        await addToTerminal(step.command, 'command');
        await new Promise(resolve => setTimeout(resolve, 300));
        await addToTerminal(step.output, 'output');
        
        currentProgress += progressIncrement;
        updateProgress(currentProgress);
        
        await new Promise(resolve => setTimeout(resolve, step.delay));
    }

    addProcessLog('System successfully compromised!');
    container.style.opacity = '1';
    updateDataStream();
}

function updateProgress(progress) {
    progressBar.style.width = `${progress}%`;
    const messages = [
        "Initializing attack vectors...",
        "Scanning target system...",
        "Exploiting vulnerabilities...",
        "Bypassing security...",
        "Gaining system access...",
        "Establishing persistence...",
        "System compromised!"
    ];
    progressStatus.textContent = messages[Math.floor((progress / 100) * (messages.length - 1))];
}

// Binary data stream with varying patterns
function updateDataStream() {
    const dataStream = document.getElementById('dataStream');
    const patterns = [
        () => Math.random().toString(2).substring(2, 34),
        () => Math.random().toString(16).substring(2, 34).toUpperCase(),
        () => Buffer.from(Math.random().toString()).toString('base64').substring(0, 32)
    ];
    
    setInterval(() => {
        const pattern = patterns[Math.floor(Math.random() * patterns.length)]();
        dataStream.textContent = pattern;
    }, 100);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', async () => {
    await getSystemInfo();
    simulateHacking();
    setInterval(updateHackStats, 1000);
});
