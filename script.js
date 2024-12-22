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
    const successAnimation = document.querySelector('.fingerprint-success');
    
    // Handle fingerprint scan
    let scanTimeout;
    let progressInterval;
    let progress = 0;
    let isScanning = false;
    const SCAN_DURATION = 3000; // 3 seconds to complete
    const PROGRESS_STEP = 100 / (SCAN_DURATION / 20); // Update every 20ms

    function setProgress(percent) {
        progressFill.style.width = `${percent}%`;
        const displayText = `${Math.round(percent)}%`;
        progressText.textContent = displayText;
        progressText.setAttribute('data-text', displayText);
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
        
        progressInterval = setInterval(() => {
            progress += PROGRESS_STEP;
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
        successAnimation.classList.remove('hidden');
        
        setTimeout(() => {
            successAnimation.classList.add('hidden');
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
            addTerminalLine(cmd.text);
            await sleep(cmd.delay);
        }

        const visitorInfo = await getVisitorInfo();
        await sleep(500);
        
        if (visitorInfo) {
            addTerminalLine(`> IP Address located: ${maskIP(visitorInfo.ip)}`);
            await sleep(300);
            addTerminalLine(`> Location triangulated: ${maskLocation(visitorInfo.location.city, visitorInfo.location.country_name)}`);
            await sleep(300);
        }
        
        addTerminalLine('> Analyzing system environment...');
        await sleep(500);
        
        addTerminalLine(`> Browser fingerprint: ${navigator.userAgent}`);
        await sleep(300);
        addTerminalLine(`> Operating system: ${navigator.platform}`);
        await sleep(300);
        addTerminalLine(`> System language: ${navigator.language}`);
        await sleep(500);
        
        addTerminalLine('> Hack complete! System compromised! 😈');
        getRandomDadJoke();
    }

    function addTerminalLine(text, type = 'command') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
