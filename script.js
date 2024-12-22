// Initialize Matrix Rain
const matrixCanvas = document.getElementById('matrix-rain');
new MatrixRain(matrixCanvas);

// Fingerprint scanner simulation
const scannerContainer = document.getElementById('scanner-container');
const mainContainer = document.getElementById('main-container');
const terminalOutput = document.getElementById('terminalOutput');

document.addEventListener('DOMContentLoaded', () => {
    const scanner = document.querySelector('.scanner-prompt');
    const scannerContainer = document.getElementById('scanner-container');
    const mainContainer = document.getElementById('main-container');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const scanError = document.querySelector('.scan-error');
    const scanStatus = document.querySelector('.scan-status');
    const burstContainer = document.querySelector('.burst-container');
    
    let scanTimeout;
    let progressInterval;
    let progress = 0;
    let isScanning = false;
    const SCAN_DURATION = 3000;
    const PROGRESS_STEP = 100 / (SCAN_DURATION / 20);

    function createBurst() {
        // Create burst lines
        for(let i = 0; i < 20; i++) {
            const line = document.createElement('div');
            line.className = 'burst-line';
            const angle = (i / 20) * 360;
            line.style.setProperty('--rotation', `${angle}deg`);
            line.style.left = '50%';
            line.style.top = '50%';
            line.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            burstContainer.appendChild(line);
        }

        // Animate fingerprint paths
        const paths = document.querySelectorAll('.fingerprint-lines path');
        paths.forEach(path => {
            const tx = (Math.random() - 0.5) * 100;
            const ty = (Math.random() - 0.5) * 100;
            path.style.setProperty('--tx', `${tx}%`);
            path.style.setProperty('--ty', `${ty}%`);
        });
    }

    function setProgress(percent) {
        progressFill.style.width = `${percent}%`;
        const displayText = `${Math.round(percent)}%`;
        progressText.textContent = displayText;
        progressText.setAttribute('data-text', displayText);
        progressText.setAttribute('data-progress', Math.round(percent));

        if (percent >= 100) {
            document.querySelector('.fingerprint-scanner').classList.add('bursting');
            document.querySelector('.fingerprint-burst').classList.add('active');
            setTimeout(() => {
                scannerContainer.classList.add('hidden');
                mainContainer.classList.remove('hidden');
            }, 1500);
        }
    }

    function startScan(e) {
        e.preventDefault();
        if (isScanning) return;
        
        isScanning = true;
        scanner.classList.add('scanning');
        scanError.classList.add('hidden');
        scanStatus.textContent = "Almost there... Keep holding! 😰";
        progress = 0;
        setProgress(0);
        
        let scanSpeed = 0;
        
        progressInterval = setInterval(() => {
            progress += PROGRESS_STEP;
            scanSpeed = Math.min(0.8, progress / 100); // Max speed factor
            document.querySelector('.scan-line').style.setProperty('--scan-progress', scanSpeed);
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                completeScan();
            }
            setProgress(progress);
        }, 20);
    }

    function stopScan() {
        if (!isScanning) return;
        
        isScanning = false;
        scanner.classList.remove('scanning');
        clearTimeout(scanTimeout);
        clearInterval(progressInterval);
        
        if (progress < 100) {
            scanError.classList.remove('hidden');
            scanStatus.textContent = "Don't be scared, I won't bite! 😈";
            progress = 0;
            setProgress(0);
        }
    }

    function completeScan() {
        clearInterval(progressInterval);
        clearTimeout(scanTimeout);
        scanner.classList.remove('scanning');
        document.querySelector('.fingerprint-burst').classList.remove('hidden');
        createBurst();
        
        setTimeout(() => {
            document.querySelector('.fingerprint-burst').classList.add('hidden');
            burstContainer.innerHTML = '';
            scannerContainer.classList.add('hidden');
            mainContainer.classList.remove('hidden');
            startHacking();
        }, 1000);
    }

    scanner.addEventListener('mousedown', startScan);
    scanner.addEventListener('touchstart', startScan);
    scanner.addEventListener('mouseup', stopScan);
    scanner.addEventListener('touchend', stopScan);
    scanner.addEventListener('mouseleave', stopScan);

    function maskIP(ip) {
        return ip.split('.').map((octet, i) => i < 3 ? '**' : octet).join('.');
    }

    function maskLocation(city, country) {
        return `******, ${country}`;
    }

    async function getVisitorInfo() {
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            
            const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
            const locationData = await locationResponse.json();
            
            document.getElementById('ipAddress').textContent = maskIP(ipData.ip);
            document.getElementById('locationInfo').textContent = maskLocation(locationData.city, locationData.country_name);
            document.getElementById('browserInfo').textContent = navigator.userAgent;
            document.getElementById('systemInfo').textContent = `${navigator.platform} - ${navigator.language}`;
            
            return { ip: ipData.ip, location: locationData };
        } catch (error) {
            console.error('Error fetching visitor info:', error);
            return null;
        }
    }

    async function getRandomDadJoke() {
        try {
            const response = await fetch('https://icanhazdadjoke.com/', {
                headers: { 'Accept': 'application/json' }
            });
            const data = await response.json();
            document.getElementById('randomJoke').textContent = data.joke;
        } catch (error) {
            console.error('Error fetching joke:', error);
        }
    }

    async function startHacking() {
        const commands = [
            { text: '> Initializing system breach...', delay: 1000 },
            { text: '> Bypassing security protocols...', delay: 800 },
            { text: '> Accessing network configuration...', delay: 1000 },
            { text: '> Intercepting data streams...', delay: 800 },
            { text: '> Scanning for vulnerabilities...', delay: 1000 },
            { text: '> Target system identified!', delay: 500 }
        ];

        for (const cmd of commands) {
            await typeTerminalText(cmd.text, 'info');
            await sleep(cmd.delay);
        }

        const visitorInfo = await getVisitorInfo();
        await sleep(500);
        
        if (visitorInfo) {
            await typeTerminalText(`> IP Address located: ${maskIP(visitorInfo.ip)}`, 'success');
            await sleep(300);
            await typeTerminalText(`> Location triangulated: ${maskLocation(visitorInfo.location.city, visitorInfo.location.country_name)}`, 'success');
            await sleep(300);
        }
        
        await typeTerminalText('> Analyzing system environment...', 'info');
        await sleep(500);
        
        await typeTerminalText(`> Browser fingerprint: ${navigator.userAgent}`, 'error');
        await sleep(300);
        await typeTerminalText(`> Operating system: ${navigator.platform}`, 'error');
        await sleep(300);
        await typeTerminalText(`> System language: ${navigator.language}`, 'error');
        await sleep(500);
        
        await typeTerminalText('> Hack complete! System compromised! 😈', 'warning');
        getRandomDadJoke();
    }

    function addTerminalLine(text, type = '') {
        const terminal = document.getElementById('terminalOutput');
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }

    function typeTerminalText(text, type = '') {
        return new Promise((resolve) => {
            let index = 0;
            let speed = Math.random() * 20 + 20; // Random speed between 20ms and 40ms
            
            const interval = setInterval(() => {
                if (index === 0) {
                    addTerminalLine('', type);
                }
                
                const currentLine = document.querySelector('.terminal-line:last-child');
                currentLine.textContent += text[index];
                
                // Auto scroll
                const terminal = document.getElementById('terminalOutput');
                terminal.scrollTop = terminal.scrollHeight;
                
                index++;
                
                // Add random pauses
                if (text[index] === '.' || text[index] === '!' || text[index] === '?') {
                    speed = Math.random() * 200 + 100; // Longer pause for punctuation
                } else {
                    speed = Math.random() * 20 + 20; // Normal typing speed
                }
                
                if (index >= text.length) {
                    clearInterval(interval);
                    setTimeout(resolve, 100); // Small pause after line completion
                }
            }, speed);
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Dialog functionality
    document.querySelector('.dev-link').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.dev-dialog-overlay').classList.add('active');
        document.querySelector('.dev-dialog').classList.add('active');
    });

    document.querySelector('.dev-dialog-btn').addEventListener('click', function() {
        window.open('https://github.com/anonfaded', '_blank');
        closeDialog();
    });

    document.querySelector('.close-btn').addEventListener('click', closeDialog);
    document.querySelector('.dev-dialog-overlay').addEventListener('click', closeDialog);

    function closeDialog() {
        document.querySelector('.dev-dialog-overlay').classList.remove('active');
        document.querySelector('.dev-dialog').classList.remove('active');
    }

    // Terminal functionality
    function addToTerminal(text, delay = 50) {
        const terminal = document.getElementById('terminal-content');
        const lines = text.split('\n');
        let i = 0;

        function addLine() {
            if (i < lines.length) {
                const line = document.createElement('div');
                line.textContent = lines[i];
                terminal.appendChild(line);
                terminal.scrollTop = terminal.scrollHeight;
                i++;
                setTimeout(addLine, delay);
            }
        }

        addLine();
    }

    // Example terminal content
    const terminalText = `[*] Initializing system scan...
[+] Accessing target device...
[+] Collecting system information...
[+] Analyzing browser data...
[+] Scanning network ports...
[*] Target information acquired successfully
[>] Running security protocols...
[>] Establishing secure connection...
[✓] Access granted`;

    // Add interactive elements suggestions:
    // 1. Matrix rain effect on hover over certain elements
    // 2. Interactive terminal where users can type basic commands
    // 3. Easter eggs in the console
    // 4. Hidden keyboard shortcuts
    // 5. "Hack attempt" mini-game
    // 6. Glitch effects on images
    // 7. Secret morse code messages
    // 8. Hidden QR codes
    // 9. Interactive 3D elements
    // 10. Voice command easter eggs
});
