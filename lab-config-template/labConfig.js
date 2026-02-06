/**
 * Lab Configuration - Placeholder Replacement System
 * ==================================================
 * Allows users to enter their unique lab values once and have them 
 * automatically replace placeholders throughout the guide.
 * 
 * CUSTOMIZATION: Search for "CUSTOMIZE" comments to find all areas
 * you need to modify for your own placeholders.
 */

(function() {
    'use strict';

    // =========================================================================
    // CUSTOMIZE: Define your placeholders here
    // =========================================================================
    // Format: 'INPUT_NAME': { pattern: /regex/g, prefix: 'before', suffix: 'after' }
    // 
    // Example: If user enters "123" for XXX:
    //   pattern: /cbXXX/g, prefix: 'cb', suffix: ''
    //   Result: "cbXXX" becomes "cb123"
    //
    const PLACEHOLDERS = {
        'XXX': { pattern: /cbXXX/g, prefix: 'cb', suffix: '' },
        'YY': { pattern: /dc-YY\.com/g, prefix: 'dc-', suffix: '.com' },
        'ZZZZ': { pattern: /dCloudZZZZ!/g, prefix: 'dCloud', suffix: '!' }
    };

    // CUSTOMIZE: Storage key (change if you have multiple labs that might conflict)
    const STORAGE_KEY = 'labConfigValues';

    // =========================================================================
    // CUSTOMIZE: Default/empty values for your placeholders
    // =========================================================================
    function getDefaultValues() {
        return { XXX: '', YY: '', ZZZZ: '' };
    }

    // =========================================================================
    // CUSTOMIZE: Check if any values are configured
    // =========================================================================
    function hasConfiguredValues() {
        const values = loadValues();
        return values.XXX || values.YY || values.ZZZZ;
    }

    // =========================================================================
    // Core functionality (generally doesn't need customization)
    // =========================================================================

    function loadValues() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : getDefaultValues();
        } catch (e) {
            console.warn('Failed to load lab config:', e);
            return getDefaultValues();
        }
    }

    function saveValues(values) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
            return true;
        } catch (e) {
            console.error('Failed to save lab config:', e);
            return false;
        }
    }

    /**
     * Hide content initially to prevent flash of unreplaced placeholders
     */
    function hideContentInitially() {
        if (!hasConfiguredValues()) return;
        
        const style = document.createElement('style');
        style.id = 'lab-config-loading-style';
        style.textContent = `
            .md-content {
                opacity: 0;
                transition: opacity 0.15s ease-in;
            }
            .md-content.lab-config-ready {
                opacity: 1;
            }
            .lab-config-loading {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                background: rgba(26, 26, 46, 0.95);
                padding: 20px 30px;
                border-radius: 10px;
                color: #00d4aa;
                font-family: system-ui, -apple-system, sans-serif;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            }
            .lab-config-spinner {
                width: 20px;
                height: 20px;
                border: 3px solid rgba(0, 212, 170, 0.3);
                border-top-color: #00d4aa;
                border-radius: 50%;
                animation: lab-config-spin 0.8s linear infinite;
            }
            @keyframes lab-config-spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    function showLoading() {
        if (!hasConfiguredValues()) return;
        
        const loader = document.createElement('div');
        loader.id = 'lab-config-loader';
        loader.className = 'lab-config-loading';
        loader.innerHTML = '<div class="lab-config-spinner"></div><span>Applying your lab config...</span>';
        document.body.appendChild(loader);
    }

    function revealContent() {
        const loader = document.getElementById('lab-config-loader');
        if (loader) loader.remove();
        
        const content = document.querySelector('.md-content');
        if (content) content.classList.add('lab-config-ready');
        
        setTimeout(() => {
            const style = document.getElementById('lab-config-loading-style');
            if (style) style.remove();
            if (content) content.classList.remove('lab-config-ready');
        }, 200);
    }

    // Run hide IMMEDIATELY (before DOM ready) to prevent flash
    hideContentInitially();

    /**
     * Replace placeholders in text content
     */
    function replacePlaceholders(text, values) {
        let result = text;
        
        Object.keys(PLACEHOLDERS).forEach(key => {
            if (values[key]) {
                const { pattern, prefix, suffix } = PLACEHOLDERS[key];
                result = result.replace(pattern, prefix + values[key] + suffix);
            }
        });
        
        return result;
    }

    /**
     * Apply replacements to the page content
     */
    function applyReplacements() {
        const values = loadValues();
        
        if (!hasConfiguredValues()) {
            revealContent();
            return;
        }

        const contentArea = document.querySelector('.md-content');
        if (!contentArea) {
            revealContent();
            return;
        }

        // Walk through all text nodes and replace placeholders
        const walker = document.createTreeWalker(
            contentArea,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const nodesToUpdate = [];
        let node;
        while (node = walker.nextNode()) {
            const original = node.textContent;
            const replaced = replacePlaceholders(original, values);
            if (original !== replaced) {
                nodesToUpdate.push({ node, replaced });
            }
        }

        nodesToUpdate.forEach(({ node, replaced }) => {
            node.textContent = replaced;
        });

        // Also update code blocks
        contentArea.querySelectorAll('code, pre').forEach(el => {
            const original = el.textContent;
            const replaced = replacePlaceholders(original, values);
            if (original !== replaced) {
                el.textContent = replaced;
            }
        });

        revealContent();
    }

    // =========================================================================
    // CUSTOMIZE: Embedded form HTML (appears where you put the div)
    // =========================================================================
    function initConfigForm() {
        const configContainer = document.getElementById('lab-config-container');
        if (!configContainer) return;

        const values = loadValues();

        // CUSTOMIZE: Update the labels, placeholders, and help text below
        configContainer.innerHTML = `
            <div class="lab-config-form" style="
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                border-radius: 12px;
                padding: 24px;
                margin: 20px 0;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            ">
                <h3 style="
                    color: #00d4aa;
                    margin-top: 0;
                    margin-bottom: 16px;
                    font-size: 1.3em;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <span style="font-size: 1.4em;">⚙️</span>
                    Configure Your Lab Environment
                </h3>
                <p style="color: #a0a0a0; margin-bottom: 20px; font-size: 0.95em;">
                    Enter your unique pod values below. These will automatically replace placeholders 
                    throughout the entire lab guide.
                </p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
                    <!-- CUSTOMIZE: Input field for XXX -->
                    <div>
                        <label style="display: block; color: #e0e0e0; margin-bottom: 6px; font-weight: 500;">
                            Pod Number <span style="color: #888; font-weight: normal;">(e.g., 123)</span>
                        </label>
                        <input type="text" id="lab-config-xxx" value="${values.XXX}" 
                            placeholder="Enter pod number"
                            style="
                                width: 100%;
                                padding: 10px 14px;
                                border: 2px solid #0f3460;
                                border-radius: 6px;
                                background: #0d1b2a;
                                color: #ffffff;
                                font-size: 1em;
                                box-sizing: border-box;
                                transition: border-color 0.2s;
                            "
                            onfocus="this.style.borderColor='#00d4aa'"
                            onblur="this.style.borderColor='#0f3460'"
                        >
                        <small style="color: #666; display: block; margin-top: 4px;">Used in: cb<strong>XXX</strong>.dc-YY.com</small>
                    </div>
                    <!-- CUSTOMIZE: Input field for YY -->
                    <div>
                        <label style="display: block; color: #e0e0e0; margin-bottom: 6px; font-weight: 500;">
                            Datacenter <span style="color: #888; font-weight: normal;">(e.g., 01)</span>
                        </label>
                        <input type="text" id="lab-config-yy" value="${values.YY}" 
                            placeholder="Enter datacenter"
                            style="
                                width: 100%;
                                padding: 10px 14px;
                                border: 2px solid #0f3460;
                                border-radius: 6px;
                                background: #0d1b2a;
                                color: #ffffff;
                                font-size: 1em;
                                box-sizing: border-box;
                                transition: border-color 0.2s;
                            "
                            onfocus="this.style.borderColor='#00d4aa'"
                            onblur="this.style.borderColor='#0f3460'"
                        >
                        <small style="color: #666; display: block; margin-top: 4px;">Used in: cbXXX.dc-<strong>YY</strong>.com</small>
                    </div>
                    <!-- CUSTOMIZE: Input field for ZZZZ -->
                    <div>
                        <label style="display: block; color: #e0e0e0; margin-bottom: 6px; font-weight: 500;">
                            Session ID <span style="color: #888; font-weight: normal;">(e.g., 1234)</span>
                        </label>
                        <input type="text" id="lab-config-zzzz" value="${values.ZZZZ}" 
                            placeholder="Enter session ID"
                            style="
                                width: 100%;
                                padding: 10px 14px;
                                border: 2px solid #0f3460;
                                border-radius: 6px;
                                background: #0d1b2a;
                                color: #ffffff;
                                font-size: 1em;
                                box-sizing: border-box;
                                transition: border-color 0.2s;
                            "
                            onfocus="this.style.borderColor='#00d4aa'"
                            onblur="this.style.borderColor='#0f3460'"
                        >
                        <small style="color: #666; display: block; margin-top: 4px;">Used in: dCloud<strong>ZZZZ</strong>!</small>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
                    <button id="lab-config-save" style="
                        background: linear-gradient(135deg, #00d4aa 0%, #00a896 100%);
                        color: #000;
                        border: none;
                        padding: 12px 28px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 1em;
                        transition: transform 0.2s, box-shadow 0.2s;
                    "
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 212, 170, 0.4)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                    >
                        💾 Save & Apply
                    </button>
                    <button id="lab-config-clear" style="
                        background: transparent;
                        color: #ff6b6b;
                        border: 2px solid #ff6b6b;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 500;
                        font-size: 0.95em;
                        transition: background 0.2s;
                    "
                    onmouseover="this.style.background='rgba(255, 107, 107, 0.1)'"
                    onmouseout="this.style.background='transparent'"
                    >
                        Clear Values
                    </button>
                    <span id="lab-config-status" style="color: #00d4aa; margin-left: 10px; opacity: 0; transition: opacity 0.3s;"></span>
                </div>
                <!-- CUSTOMIZE: Preview section -->
                <div id="lab-config-preview" style="
                    margin-top: 20px;
                    padding: 16px;
                    background: #0d1b2a;
                    border-radius: 8px;
                    border: 1px solid #0f3460;
                    display: ${values.XXX || values.YY || values.ZZZZ ? 'block' : 'none'};
                ">
                    <strong style="color: #00d4aa;">Preview:</strong>
                    <div style="color: #e0e0e0; margin-top: 8px; font-family: monospace;">
                        <div>Domain: <span id="preview-domain" style="color: #4ecdc4;">cb${values.XXX || 'XXX'}.dc-${values.YY || 'YY'}.com</span></div>
                        <div>Password: <span id="preview-password" style="color: #4ecdc4;">dCloud${values.ZZZZ || 'ZZZZ'}!</span></div>
                    </div>
                </div>
            </div>
        `;

        // Event listeners for embedded form
        const saveBtn = document.getElementById('lab-config-save');
        const clearBtn = document.getElementById('lab-config-clear');
        const xxxInput = document.getElementById('lab-config-xxx');
        const yyInput = document.getElementById('lab-config-yy');
        const zzzzInput = document.getElementById('lab-config-zzzz');
        const statusEl = document.getElementById('lab-config-status');
        const previewEl = document.getElementById('lab-config-preview');
        const previewDomain = document.getElementById('preview-domain');
        const previewPassword = document.getElementById('preview-password');

        // CUSTOMIZE: Update preview function
        function updatePreview() {
            const xxx = xxxInput.value || 'XXX';
            const yy = yyInput.value || 'YY';
            const zzzz = zzzzInput.value || 'ZZZZ';
            
            previewDomain.textContent = `cb${xxx}.dc-${yy}.com`;
            previewPassword.textContent = `dCloud${zzzz}!`;
            previewEl.style.display = (xxxInput.value || yyInput.value || zzzzInput.value) ? 'block' : 'none';
        }

        [xxxInput, yyInput, zzzzInput].forEach(input => {
            input.addEventListener('input', updatePreview);
        });

        // CUSTOMIZE: Save handler - update to match your input IDs
        saveBtn.addEventListener('click', function() {
            const newValues = {
                XXX: xxxInput.value.trim(),
                YY: yyInput.value.trim(),
                ZZZZ: zzzzInput.value.trim()
            };

            if (saveValues(newValues)) {
                statusEl.textContent = '✓ Saved! Refreshing page...';
                statusEl.style.opacity = '1';
                setTimeout(() => window.location.reload(), 800);
            } else {
                statusEl.textContent = '✗ Failed to save';
                statusEl.style.color = '#ff6b6b';
                statusEl.style.opacity = '1';
            }
        });

        clearBtn.addEventListener('click', function() {
            xxxInput.value = '';
            yyInput.value = '';
            zzzzInput.value = '';
            saveValues(getDefaultValues());
            updatePreview();
            statusEl.textContent = '✓ Values cleared! Refreshing...';
            statusEl.style.opacity = '1';
            setTimeout(() => window.location.reload(), 800);
        });
    }

    // =========================================================================
    // Scroll position management
    // =========================================================================
    function saveScrollPosition() {
        sessionStorage.setItem('labConfigScrollPos', window.scrollY.toString());
    }

    function restoreScrollPosition() {
        const savedPos = sessionStorage.getItem('labConfigScrollPos');
        if (savedPos) {
            sessionStorage.removeItem('labConfigScrollPos');
            setTimeout(() => window.scrollTo(0, parseInt(savedPos, 10)), 100);
        }
    }

    // =========================================================================
    // CUSTOMIZE: Floating button and modal
    // =========================================================================
    function createFloatingButton() {
        // Don't show on print page
        if (window.location.pathname.includes('print_page')) {
            return;
        }

        // Add styles
        const style = document.createElement('style');
        style.id = 'lab-config-fab-styles';
        style.textContent = `
            @media print {
                .lab-config-fab,
                .lab-config-modal-overlay {
                    display: none !important;
                }
            }
            .lab-config-fab {
                position: fixed;
                bottom: 24px;
                left: 24px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #00d4aa 0%, #00a896 100%);
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 212, 170, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                transition: transform 0.2s, box-shadow 0.2s;
                z-index: 1000;
            }
            .lab-config-fab:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0, 212, 170, 0.5);
            }
            .lab-config-fab-tooltip {
                position: absolute;
                left: 70px;
                background: #1a1a2e;
                color: #fff;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s;
            }
            .lab-config-fab:hover .lab-config-fab-tooltip {
                opacity: 1;
            }
            .lab-config-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s, visibility 0.3s;
            }
            .lab-config-modal-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            .lab-config-modal {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                border-radius: 16px;
                padding: 28px;
                max-width: 520px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                opacity: 0;
                transform: translateY(-20px) scale(1);
                transition: opacity 0.3s, transform 0.3s;
                font-size: 16px;
                line-height: 1.5;
            }
            .lab-config-modal-overlay.active .lab-config-modal {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            .lab-config-modal-close {
                position: absolute;
                top: 12px;
                right: 16px;
                background: none;
                border: none;
                color: #888;
                font-size: 28px;
                cursor: pointer;
                transition: color 0.2s;
            }
            .lab-config-modal-close:hover {
                color: #ff6b6b;
            }
            .lab-config-modal h3 {
                color: #00d4aa;
                margin-top: 0;
                margin-bottom: 16px;
                font-size: 22px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .lab-config-modal p {
                color: #a0a0a0;
                margin-bottom: 20px;
                font-size: 15px;
            }
            .lab-config-modal-input-group {
                margin-bottom: 16px;
            }
            .lab-config-modal-input-group label {
                display: block;
                color: #e0e0e0;
                margin-bottom: 6px;
                font-weight: 500;
                font-size: 15px;
            }
            .lab-config-modal-input-group label span {
                color: #888;
                font-weight: normal;
                font-size: 14px;
            }
            .lab-config-modal-input-group input {
                width: 100%;
                padding: 12px 14px;
                border: 2px solid #0f3460;
                border-radius: 6px;
                background: #0d1b2a;
                color: #ffffff;
                font-size: 16px;
                box-sizing: border-box;
                transition: border-color 0.2s;
            }
            .lab-config-modal-input-group input:focus {
                outline: none;
                border-color: #00d4aa;
            }
            .lab-config-modal-input-group small {
                color: #666;
                display: block;
                margin-top: 4px;
                font-size: 13px;
            }
            .lab-config-modal-buttons {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                align-items: center;
                margin-top: 20px;
            }
            .lab-config-modal-save {
                background: linear-gradient(135deg, #00d4aa 0%, #00a896 100%);
                color: #000;
                border: none;
                padding: 12px 28px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                font-size: 16px;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .lab-config-modal-save:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 212, 170, 0.4);
            }
            .lab-config-modal-clear {
                background: transparent;
                color: #ff6b6b;
                border: 2px solid #ff6b6b;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                font-size: 15px;
                transition: background 0.2s;
            }
            .lab-config-modal-clear:hover {
                background: rgba(255, 107, 107, 0.1);
            }
            .lab-config-modal-status {
                color: #00d4aa;
                margin-left: 10px;
                opacity: 0;
                transition: opacity 0.3s;
            }
            .lab-config-modal-preview {
                margin-top: 20px;
                padding: 16px;
                background: #0d1b2a;
                border-radius: 8px;
                border: 1px solid #0f3460;
                font-size: 15px;
            }
            .lab-config-modal-preview strong {
                color: #00d4aa;
            }
            .lab-config-modal-preview-values {
                color: #e0e0e0;
                margin-top: 8px;
                font-family: monospace;
                font-size: 14px;
            }
            .lab-config-modal-preview-values span {
                color: #4ecdc4;
            }
        `;
        document.head.appendChild(style);

        // Create floating button
        const fab = document.createElement('button');
        fab.className = 'lab-config-fab';
        fab.innerHTML = '⚙️<span class="lab-config-fab-tooltip">Edit Lab Config</span>';
        fab.addEventListener('click', openModal);
        document.body.appendChild(fab);

        // Create modal
        const overlay = document.createElement('div');
        overlay.className = 'lab-config-modal-overlay';
        overlay.id = 'lab-config-modal-overlay';
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeModal();
        });

        const values = loadValues();
        
        // CUSTOMIZE: Update the modal HTML to match your placeholders
        overlay.innerHTML = `
            <div class="lab-config-modal" style="position: relative;">
                <button class="lab-config-modal-close" id="lab-config-modal-close">&times;</button>
                <h3><span style="font-size: 1.4em;">⚙️</span> Edit Lab Configuration</h3>
                <p>Update your pod values below. Changes will be applied immediately.</p>
                
                <!-- CUSTOMIZE: Input fields -->
                <div class="lab-config-modal-input-group">
                    <label>Pod Number <span>(e.g., 123)</span></label>
                    <input type="text" id="modal-config-xxx" value="${values.XXX}" placeholder="Enter pod number">
                    <small>Used in domain: cb<strong>XXX</strong>.dc-YY.com</small>
                </div>
                
                <div class="lab-config-modal-input-group">
                    <label>Datacenter <span>(e.g., 01)</span></label>
                    <input type="text" id="modal-config-yy" value="${values.YY}" placeholder="Enter datacenter">
                    <small>Used in domain: cbXXX.dc-<strong>YY</strong>.com</small>
                </div>
                
                <div class="lab-config-modal-input-group">
                    <label>Session ID <span>(last 4 digits)</span></label>
                    <input type="text" id="modal-config-zzzz" value="${values.ZZZZ}" placeholder="Enter session ID">
                    <small>Used in password: dCloud<strong>ZZZZ</strong>!</small>
                </div>
                
                <!-- CUSTOMIZE: Preview section -->
                <div class="lab-config-modal-preview" id="modal-config-preview" style="display: ${values.XXX || values.YY || values.ZZZZ ? 'block' : 'none'};">
                    <strong>Preview:</strong>
                    <div class="lab-config-modal-preview-values">
                        <div>Domain: <span id="modal-preview-domain">cb${values.XXX || 'XXX'}.dc-${values.YY || 'YY'}.com</span></div>
                        <div>Password: <span id="modal-preview-password">dCloud${values.ZZZZ || 'ZZZZ'}!</span></div>
                    </div>
                </div>
                
                <div class="lab-config-modal-buttons">
                    <button class="lab-config-modal-save" id="modal-config-save">💾 Save & Apply</button>
                    <button class="lab-config-modal-clear" id="modal-config-clear">Clear Values</button>
                    <span class="lab-config-modal-status" id="modal-config-status"></span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Modal event listeners
        document.getElementById('lab-config-modal-close').addEventListener('click', closeModal);
        
        const modalXxx = document.getElementById('modal-config-xxx');
        const modalYy = document.getElementById('modal-config-yy');
        const modalZzzz = document.getElementById('modal-config-zzzz');
        const modalPreview = document.getElementById('modal-config-preview');
        const modalPreviewDomain = document.getElementById('modal-preview-domain');
        const modalPreviewPassword = document.getElementById('modal-preview-password');
        const modalStatus = document.getElementById('modal-config-status');

        // CUSTOMIZE: Modal preview function
        function updateModalPreview() {
            const xxx = modalXxx.value || 'XXX';
            const yy = modalYy.value || 'YY';
            const zzzz = modalZzzz.value || 'ZZZZ';
            modalPreviewDomain.textContent = `cb${xxx}.dc-${yy}.com`;
            modalPreviewPassword.textContent = `dCloud${zzzz}!`;
            modalPreview.style.display = (modalXxx.value || modalYy.value || modalZzzz.value) ? 'block' : 'none';
        }

        [modalXxx, modalYy, modalZzzz].forEach(input => {
            input.addEventListener('input', updateModalPreview);
        });

        // CUSTOMIZE: Modal save handler
        document.getElementById('modal-config-save').addEventListener('click', function() {
            const newValues = {
                XXX: modalXxx.value.trim(),
                YY: modalYy.value.trim(),
                ZZZZ: modalZzzz.value.trim()
            };
            if (saveValues(newValues)) {
                modalStatus.textContent = '✓ Saved! Refreshing...';
                modalStatus.style.opacity = '1';
                saveScrollPosition();
                setTimeout(() => window.location.reload(), 600);
            } else {
                modalStatus.textContent = '✗ Failed to save';
                modalStatus.style.color = '#ff6b6b';
                modalStatus.style.opacity = '1';
            }
        });

        document.getElementById('modal-config-clear').addEventListener('click', function() {
            modalXxx.value = '';
            modalYy.value = '';
            modalZzzz.value = '';
            saveValues(getDefaultValues());
            updateModalPreview();
            modalStatus.textContent = '✓ Cleared! Refreshing...';
            modalStatus.style.opacity = '1';
            saveScrollPosition();
            setTimeout(() => window.location.reload(), 600);
        });

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        });
    }

    function openModal() {
        const overlay = document.getElementById('lab-config-modal-overlay');
        if (overlay) {
            const values = loadValues();
            document.getElementById('modal-config-xxx').value = values.XXX;
            document.getElementById('modal-config-yy').value = values.YY;
            document.getElementById('modal-config-zzzz').value = values.ZZZZ;
            
            const previewDomain = document.getElementById('modal-preview-domain');
            const previewPassword = document.getElementById('modal-preview-password');
            const preview = document.getElementById('modal-config-preview');
            previewDomain.textContent = `cb${values.XXX || 'XXX'}.dc-${values.YY || 'YY'}.com`;
            previewPassword.textContent = `dCloud${values.ZZZZ || 'ZZZZ'}!`;
            preview.style.display = (values.XXX || values.YY || values.ZZZZ) ? 'block' : 'none';
            
            overlay.classList.add('active');
        }
    }

    function closeModal() {
        const overlay = document.getElementById('lab-config-modal-overlay');
        if (overlay) overlay.classList.remove('active');
    }

    /**
     * Fix internal links on print page
     */
    function fixPrintPageLinks() {
        if (!window.location.pathname.includes('print_page')) return;
        
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            const match = href.match(/^\.?\/?[^#]+\.md(#.+)$/);
            if (match) {
                link.setAttribute('href', match[1]);
            }
        });
    }

    // =========================================================================
    // Initialize
    // =========================================================================
    function init() {
        showLoading();
        initConfigForm();
        applyReplacements();
        createFloatingButton();
        fixPrintPageLinks();
        restoreScrollPosition();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
