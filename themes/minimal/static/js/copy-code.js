document.addEventListener('DOMContentLoaded', function() {
    // Add copy buttons to code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(function(codeBlock) {
        const pre = codeBlock.parentElement;
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        button.setAttribute('aria-label', 'Copy code to clipboard');
        wrapper.appendChild(button);
        
        button.addEventListener('click', function() {
            const code = codeBlock.textContent;
            
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(code).then(function() {
                    button.textContent = 'Copied!';
                    setTimeout(function() {
                        button.textContent = 'Copy';
                    }, 2000);
                });
            } else {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = code;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    button.textContent = 'Copied!';
                    setTimeout(function() {
                        button.textContent = 'Copy';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
                document.body.removeChild(textarea);
            }
        });
    });
});