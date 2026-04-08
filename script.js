// pixel-poster - Retro Pixel Poster Maker

const pixelIcons = [
    { id: 1, char: '⭐' }, { id: 2, char: '❤️' }, { id: 3, char: '🔥' },
    { id: 4, char: '⚡' }, { id: 5, char: '🌟' }, { id: 6, char: '💎' },
    { id: 7, char: '🎯' }, { id: 8, char: '🏆' }, { id: 9, char: '🎪' },
    { id: 10, char: '🎨' }, { id: 11, char: '🎮' }, { id: 12, char: '🎵' },
    { id: 13, char: '🎁' }, { id: 14, char: '🎉' }, { id: 15, char: '🌈' },
    { id: 16, char: '🔮' }
];

let currentTemplate = 'event';
let selectedColor = 'retro1';
let selectedIcons = [];
let posterHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    renderIcons();
    setupEventListeners();
    updatePreview();
});

function renderIcons() {
    const grid = document.getElementById('iconsGrid');
    grid.innerHTML = '';
    
    pixelIcons.forEach(icon => {
        const el = document.createElement('div');
        el.className = 'pixel-icon';
        el.textContent = icon.char;
        el.dataset.id = icon.id;
        el.onclick = () => toggleIcon(icon);
        
        if (selectedIcons.find(i => i.id === icon.id)) {
            el.classList.add('selected');
        }
        
        if (selectedIcons.length >= 3 && !selectedIcons.find(i => i.id === icon.id)) {
            el.classList.add('disabled');
        }
        
        grid.appendChild(el);
    });
    
    updateIconCount();
    renderPlacedIcons();
    updateCanvasIcons();
}

function toggleIcon(icon) {
    const idx = selectedIcons.findIndex(i => i.id === icon.id);
    
    if (idx > -1) {
        selectedIcons.splice(idx, 1);
    } else if (selectedIcons.length < 3) {
        selectedIcons.push(icon);
    } else {
        showToast('アイコンは最大3つまで');
        return;
    }
    
    renderIcons();
}

function renderPlacedIcons() {
    const container = document.getElementById('placedIcons');
    
    if (selectedIcons.length === 0) {
        container.innerHTML = '<span class="placeholder">アイコンを選択</span>';
        return;
    }
    
    container.innerHTML = '';
    selectedIcons.forEach(icon => {
        const el = document.createElement('span');
        el.className = 'placed-icon';
        el.innerHTML = `${icon.char}<button onclick="event.stopPropagation();removeIcon(${icon.id})">×</button>`;
        container.appendChild(el);
    });
}

function removeIcon(id) {
    selectedIcons = selectedIcons.filter(i => i.id !== id);
    renderIcons();
}

function updateIconCount() {
    document.getElementById('iconCount').textContent = selectedIcons.length;
}

function setupEventListeners() {
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentTemplate = this.dataset.template;
        });
    });
    
    document.querySelectorAll('.color-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.color-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            selectedColor = this.dataset.colors;
            updatePreview();
        });
    });
    
    ['posterTitle', 'posterBody', 'posterDate'].forEach(id => {
        document.getElementById(id).addEventListener('input', updatePreview);
    });
    
    document.getElementById('shareModal').addEventListener('click', function(e) {
        if (e.target === this) closeShareModal();
    });
}

function updatePreview() {
    const canvas = document.getElementById('posterCanvas');
    const title = document.getElementById('posterTitle').value || 'タイトル';
    const body = document.getElementById('posterBody').value || '本文がここに表示されます';
    const date = document.getElementById('posterDate').value || '日時・場所';
    
    document.getElementById('canvasTitle').textContent = title;
    document.getElementById('canvasBody').textContent = body;
    document.getElementById('canvasDate').textContent = date;
    
    canvas.className = `poster-canvas ${selectedColor}`;
}

function updateCanvasIcons() {
    const container = document.getElementById('canvasIcons');
    container.innerHTML = '';
    
    selectedIcons.forEach(icon => {
        const el = document.createElement('span');
        el.className = 'pixel-icon-display';
        el.textContent = icon.char;
        container.appendChild(el);
    });
}

function generatePoster() {
    updatePreview();
    updateCanvasIcons();
    showToast('🎨 デザイン更新');
}

function downloadPoster() {
    const canvas = document.getElementById('posterCanvas');
    
    html2canvas(canvas, { scale: 2, backgroundColor: null }).then(el => {
        saveToHistory(el);
        
        const link = document.createElement('a');
        link.download = `pixel-poster-${Date.now()}.png`;
        link.href = el.toDataURL();
        link.click();
        
        showToast('💾 保存完了');
    });
}

function shareTwitter() {
    const canvas = document.getElementById('posterCanvas');
    
    html2canvas(canvas, { scale: 2, backgroundColor: null }).then(el => {
        saveToHistory(el);
        
        document.getElementById('sharePreview').innerHTML = '';
        document.getElementById('sharePreview').appendChild(el);
        document.getElementById('shareModal').classList.add('active');
        
        window.generatedCanvas = el;
    });
}

async function copyImage() {
    if (!window.generatedCanvas) return;
    try {
        const blob = await new Promise(r => window.generatedCanvas.toBlob(r, 'image/png'));
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showToast('📋 コピー完了');
    } catch (e) {
        showToast('コピー失敗');
    }
}

function closeShareModal() {
    document.getElementById('shareModal').classList.remove('active');
    window.generatedCanvas = null;
}

function saveToHistory(canvasEl) {
    const item = {
        id: Date.now(),
        dataUrl: canvasEl.toDataURL(),
        template: currentTemplate,
        color: selectedColor,
        icons: selectedIcons.map(i => i.id),
        title: document.getElementById('posterTitle').value,
        date: new Date().toISOString()
    };
    
    posterHistory.unshift(item);
    if (posterHistory.length > 10) posterHistory.pop();
    
    localStorage.setItem('pixel-poster-history', JSON.stringify(posterHistory));
    renderHistory();
}

function loadHistory() {
    const saved = localStorage.getItem('pixel-poster-history');
    if (saved) posterHistory = JSON.parse(saved);
    renderHistory();
}

function renderHistory() {
    const section = document.getElementById('historySection');
    const grid = document.getElementById('historyGrid');
    
    if (posterHistory.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    grid.innerHTML = '';
    
    posterHistory.forEach(item => {
        const el = document.createElement('div');
        el.className = 'history-item';
        el.innerHTML = `<img src="${item.dataUrl}" alt="History">`;
        el.onclick = () => loadFromHistory(item);
        grid.appendChild(el);
    });
}

function loadFromHistory(item) {
    currentTemplate = item.template;
    selectedColor = item.color;
    selectedIcons = pixelIcons.filter(i => item.icons.includes(i.id));
    
    document.getElementById('posterTitle').value = item.title || '';
    
    document.querySelectorAll('.template-card').forEach(c => {
        c.classList.remove('active');
        if (c.dataset.template === item.template) c.classList.add('active');
    });
    
    document.querySelectorAll('.color-card').forEach(c => {
        c.classList.remove('active');
        if (c.dataset.colors === item.color) c.classList.add('active');
    });
    
    renderIcons();
    updatePreview();
    showToast('📜 履歴を読み込みました');
}

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(console.error);
    });
}
// V2: Premium Subscription Functions
let isPremium = false;
let premiumExpiry = null;
let exportQuality = 2;
let customPalettes = [];

function initPremium() {
  const saved = localStorage.getItem('pixel-poster-premium');
  if (saved) {
    const data = JSON.parse(saved);
    isPremium = data.isPremium || false;
    premiumExpiry = data.expiry || null;
    if (premiumExpiry && Date.now() > premiumExpiry) {
      isPremium = false;
      premiumExpiry = null;
      localStorage.removeItem('pixel-poster-premium');
    }
  }
  updatePremiumUI();
}

function updatePremiumUI() {
  const status = document.getElementById('premiumStatus');
  if (isPremium && status) {
    status.classList.remove('hidden');
    status.querySelector('span').textContent = new Date(premiumExpiry).toLocaleDateString('ja-JP');
  }
  
  // Show premium templates if subscribed
  document.querySelectorAll('.template-card[data-premium="true"]').forEach(card => {
    if (isPremium) {
      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
      card.classList.add('premium-active');
    } else {
      card.onclick = () => openPremiumModal();
    }
  });
  
  // Enable 4x quality
  const quality4x = document.getElementById('quality4x');
  if (quality4x && isPremium) {
    quality4x.classList.add('subscribed');
    quality4x.querySelector('input').disabled = false;
  }
  
  // Show custom palette section
  const customSection = document.getElementById('customPaletteSection');
  if (customSection && isPremium) {
    customSection.classList.add('premium-active');
  }
  
  // Hide ads
  const adBanner = document.getElementById('adBanner');
  if (adBanner && isPremium) adBanner.style.display = 'none';
}

function openPremiumModal(e) {
  if (e && e.target.closest('.template-card') && e.target.closest('.template-card').dataset.premium === 'true' && !isPremium) {
    document.getElementById('premiumModal').classList.add('active');
    return false;
  }
  document.getElementById('premiumModal').classList.add('active');
}

function closePremiumModal(e) {
  if (!e || e.target.id === 'premiumModal' || e.target.classList.contains('btn-close-modal')) {
    document.getElementById('premiumModal').classList.remove('active');
  }
}

function subscribe(plan) {
  isPremium = true;
  const duration = plan === 'yearly' ? 365 : 30;
  premiumExpiry = Date.now() + (duration * 24 * 60 * 60 * 1000);
  localStorage.setItem('pixel-poster-premium', JSON.stringify({ isPremium, expiry: premiumExpiry }));
  showToast('👑 プレミアム登録完了！');
  updatePremiumUI();
  closePremiumModal();
  
  // Daily crystal bonus
  if (plan === 'yearly') showToast('🎁 お得な年額プラン登録ありがとう！');
}

function setQuality(q) {
  if (q === 4 && !isPremium) return;
  exportQuality = q;
}

function applyCustomPalette() {
  if (!isPremium) return;
  const c1 = document.getElementById('customColor1').value;
  const c2 = document.getElementById('customColor2').value;
  const c3 = document.getElementById('customColor3').value;
  
  const styleId = 'custom-palette-style';
  let style = document.getElementById(styleId);
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    document.head.appendChild(style);
  }
  
  style.textContent = `.custom { --c1: ${c1}; --c2: ${c2}; --c3: ${c3}; }`;
  selectedColor = 'custom';
  updatePreview();
  showToast('🎨 カスタム配色を適用しました');
}

// Override original download function for quality
const originalDownload = downloadPoster;
downloadPoster = function() {
  const canvas = document.getElementById('posterCanvas');
  const scale = isPremium ? exportQuality : 2;
  html2canvas(canvas, { scale: scale, backgroundColor: null }).then(el => {
    saveToHistory(el);
    const link = document.createElement('a');
    link.download = `pixel-poster-${Date.now()}.png`;
    link.href = el.toDataURL();
    link.click();
    showToast(`💾 ${scale}xで保存完了`);
  });
};

// Initialize premium on load
initPremium();

// V2: Log version
console.log('pixel-poster V2 loaded');
