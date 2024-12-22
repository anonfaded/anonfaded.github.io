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
        
        // Immediately set sarcastic text
        scanStatus.textContent = "Scared already? How predictable. 🙄";
        
        // Reset scan line progress
        document.querySelector('.scan-line').style.setProperty('--scan-progress', 0);
        
        if (progress < 100) {
            // Quickly animate progress back to 0
            let currentProgress = progress;
            const resetInterval = setInterval(() => {
                currentProgress -= PROGRESS_STEP * 2;
                if (currentProgress <= 0) {
                    currentProgress = 0;
                    clearInterval(resetInterval);
                    
                    // Show sarcastic notification
                    showNotification("Tsk tsk... losing your nerve? 😏", "error");
                }
                setProgress(currentProgress);
            }, 20);
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

    function generateRandomHexBinary() {
        const hexChars = '0123456789ABCDEF';
        const binaryChars = '01';
        let hex = '';
        let binary = '';
        
        // Generate 16 hex characters
        for (let i = 0; i < 16; i++) {
            hex += hexChars[Math.floor(Math.random() * hexChars.length)];
        }
        
        // Generate 32 binary characters
        for (let i = 0; i < 32; i++) {
            binary += binaryChars[Math.floor(Math.random() * binaryChars.length)];
        }
        
        return { hex, binary };
    }

    async function startHacking() {
        const visitorInfo = await getVisitorInfo();
        
        // Clear existing content
        terminalOutput.innerHTML = '';
        
        // Type each line with appropriate styling
        await typeTextToTerminal('Initializing system scan...', 'text-green');
        await sleep(1000);
        
        await typeTextToTerminal(`Target IP: ${maskIP(visitorInfo.ip)}`, 'text-cyan');
        await sleep(500);
        
        await typeTextToTerminal(`Location: ${maskLocation(visitorInfo.location.city, visitorInfo.location.country_name)}`, 'text-cyan');
        await sleep(500);
        
        await typeTextToTerminal(`Browser: ${navigator.userAgent}`, 'text-cyan');
        await sleep(500);
        
        await typeTextToTerminal(`System: ${navigator.platform} - ${navigator.language}`, 'text-cyan');
        await sleep(1000);
        
        await typeTextToTerminal('ACCESS GRANTED', 'text-green blink');
        await sleep(2000); // Added delay to ensure proper scrolling
        
        // Create and append hex/binary display container
        const hexBinaryContainer = document.createElement('div');
        hexBinaryContainer.className = 'hex-binary-container';
        terminalOutput.appendChild(hexBinaryContainer);
        
        // Function to update hex/binary
        function updateHexBinary() {
            const { hex, binary } = generateRandomHexBinary();
            hexBinaryContainer.innerHTML = `
                <div class="text-red">HEX: ${hex}</div>
                <div class="text-green">BIN: ${binary}</div>
            `;
        }
        
        // Initial update and scroll to bottom once
        updateHexBinary();
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        
        // Update hex/binary display every 100ms without forcing scroll
        setInterval(updateHexBinary, 100);
    }

    async function typeTextToTerminal(text, className = '') {
        const terminal = document.getElementById('terminalOutput');
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        terminal.appendChild(line);

        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        line.appendChild(cursor);

        // Split text into words
        const words = text.split(' ');
        let currentPosition = 0;

        for (let i = 0; i < words.length; i++) {
            const word = words[i] + ' ';
            
            // Increased words printed at once for faster effect (2-5 words)
            const wordsAtOnce = Math.min(Math.floor(Math.random() * 4) + 2, words.length - i);
            const wordGroup = words.slice(i, i + wordsAtOnce).join(' ') + ' ';
            i += wordsAtOnce - 1; // Skip the words we've grouped

            // Type each character in the word group
            for (let char of wordGroup) {
                line.insertBefore(document.createTextNode(char), cursor);
                currentPosition++;
                
                // Ensure terminal scrolls to show new text
                terminal.scrollTop = terminal.scrollHeight;
                
                // Super fast typing (almost instant)
                await sleep(Math.random() * 0.5 + 0.2);
            }

            // Keep small pause between word groups
            if (i < words.length - 1) {
                await sleep(Math.random() * 7 + 3);
            }
        }

        // Remove cursor after typing is complete
        line.removeChild(cursor);
        await sleep(7);
    }

    function initializeDialogs() {
        // Add click handlers for both dev links
        document.querySelectorAll('.dev-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector('.dev-dialog-overlay').classList.add('active');
                document.querySelector('.dev-dialog').classList.add('active');
            });
        });

        // Close dialog handlers
        document.querySelector('.close-btn').addEventListener('click', closeDialog);
        document.querySelector('.dev-dialog-overlay').addEventListener('click', closeDialog);
        document.querySelector('.dev-dialog-btn').addEventListener('click', function() {
            window.open('https://github.com/anonfaded', '_blank');
            closeDialog();
        });
    }

    function closeDialog() {
        document.querySelector('.dev-dialog-overlay').classList.remove('active');
        document.querySelector('.dev-dialog').classList.remove('active');
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Custom Context Menu
    const contextMenu = document.querySelector('.custom-context-menu');
    const contextMenuItems = document.querySelectorAll('.context-menu-item');

    // Function to update menu text based on screen size
    function updateMenuText() {
        const isMobile = window.innerWidth <= 480;
        const menuTexts = {
            hack: isMobile ? "Hack it" : "Attempt to hack (Good luck!)",
            inspect: isMobile ? "Inspect" : "Inspect (Nothing to see here)",
            copy: isMobile ? "Copy" : "Copy (Like you'd need this)",
            report: isMobile ? "Report" : "Report bug (It's not a bug, it's a feature)",
            exit: isMobile ? "Exit" : "Exit (You can't escape)"
        };

        contextMenuItems.forEach(item => {
            const action = item.getAttribute('data-action');
            const textElement = item.querySelector('.text');
            if (textElement && menuTexts[action]) {
                textElement.textContent = menuTexts[action];
            }
        });
    }

    // Update text on resize
    window.addEventListener('resize', updateMenuText);
    // Initial text update
    updateMenuText();

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        const { clientX: mouseX, clientY: mouseY } = e;
        const { innerWidth: winWidth, innerHeight: winHeight } = window;
        
        // Get menu dimensions
        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;
        
        // Calculate position to keep menu in viewport
        let x = mouseX;
        let y = mouseY;
        
        if (mouseX + menuWidth > winWidth) {
            x = mouseX - menuWidth;
        }
        
        if (mouseY + menuHeight > winHeight) {
            y = mouseY - menuHeight;
        }
        
        // Ensure menu stays within viewport bounds
        x = Math.max(0, Math.min(x, winWidth - menuWidth));
        y = Math.max(0, Math.min(y, winHeight - menuHeight));
        
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.classList.add('active');
    });

    document.addEventListener('click', () => {
        contextMenu.classList.remove('active');
    });

    // Handle menu item clicks with sarcastic responses
    contextMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            let message = '';
            
            switch(action) {
                case 'hack':
                    message = "Nice try, but I'm unhackable! 😈";
                    break;
                case 'inspect':
                    message = "404: Secret code not found! 🕵️‍♂️";
                    break;
                case 'copy':
                    message = "Copying is futile, resistance is not! 🚫";
                    break;
                case 'report':
                    message = "Your bug report has been sent to /dev/null 🗑️";
                    break;
                case 'exit':
                    message = "You can check out any time you like, but you can never leave! 🏨";
                    break;
            }
            
            // Create and show notification
            const notification = document.createElement('div');
            notification.className = 'hacker-notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Trigger reflow for animation
            notification.offsetHeight;
            notification.classList.add('active');
            
            // Remove notification after animation
            setTimeout(() => {
                notification.classList.remove('active');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        });
    });

    // Reveal functionality for IP and Location
    const ipAddressElement = document.getElementById('ipAddress');
    const locationInfoElement = document.getElementById('locationInfo');
    const ipRevealIcon = document.getElementById('ipRevealIcon');
    const locationRevealIcon = document.getElementById('locationRevealIcon');

    let originalIP = '';
    let originalLocation = '';

    function maskIP(ip) {
        originalIP = ip;
        return ip.split('.').map((octet, i) => i < 3 ? '**' : octet).join('.');
    }

    function maskLocation(city, country) {
        originalLocation = `${city}, ${country}`;
        return `******, ${country}`;
    }

    function toggleReveal(element, revealIcon, originalValue, isMasked) {
        if (isMasked) {
            element.textContent = originalValue;
            revealIcon.textContent = 'visibility';
            return false;
        } else {
            element.textContent = originalValue.includes(',') 
                ? maskLocation(originalValue.split(',')[0].trim(), originalValue.split(',')[1].trim())
                : maskIP(originalValue);
            revealIcon.textContent = 'visibility_off';
            return true;
        }
    }

    // Modify existing getVisitorInfo to store original values
    const originalGetVisitorInfo = getVisitorInfo;
    getVisitorInfo = async function() {
        const result = await originalGetVisitorInfo();
        
        // Setup reveal icons after getting visitor info
        ipRevealIcon.addEventListener('click', () => {
            ipRevealIcon.dataset.masked = toggleReveal(
                ipAddressElement, 
                ipRevealIcon, 
                originalIP, 
                ipRevealIcon.textContent === 'visibility_off'
            );
        });

        locationRevealIcon.addEventListener('click', () => {
            locationRevealIcon.dataset.masked = toggleReveal(
                locationInfoElement, 
                locationRevealIcon, 
                originalLocation, 
                locationRevealIcon.textContent === 'visibility_off'
            );
        });

        return result;
    };

    initializeDialogs();
});
