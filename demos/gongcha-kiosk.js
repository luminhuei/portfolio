const figures = [...document.querySelectorAll('.kiosk-figure')];

// Configure the decoder before registering model-viewer so every asset is hosted with the site.
self.ModelViewerElement = self.ModelViewerElement || {};
self.ModelViewerElement.dracoDecoderLocation = new URL('./vendor/draco/', import.meta.url).href;

for (const figure of figures) {
  const stage = figure.querySelector('.kiosk-stage');
  const viewer = figure.querySelector('model-viewer');
  const status = figure.querySelector('.kiosk-status');
  const buttons = [...figure.querySelectorAll('.kiosk-toolbar button')];
  const zh = document.documentElement.lang.toLowerCase().startsWith('zh');
  const smallScreen = matchMedia('(max-width: 600px)');
  viewer.setAttribute('camera-orbit', smallScreen.matches ? '33deg 75deg 105%' : '33deg 75deg 90%');
  const initial = {
    orbit: viewer.getAttribute('camera-orbit'),
    target: viewer.getAttribute('camera-target'),
    fov: viewer.getAttribute('field-of-view'),
  };
  smallScreen.addEventListener('change', event => {
    initial.orbit = event.matches ? '33deg 75deg 105%' : '33deg 75deg 90%';
    viewer.cameraOrbit = initial.orbit;
  });

  const fail = () => {
    stage.dataset.state = 'error';
    status.textContent = zh ? '暫時無法載入 3D，先查看攤位展示圖。' : '3D is unavailable. The kiosk image is shown instead.';
    buttons.forEach(button => { button.disabled = true; });
  };
  viewer.addEventListener('error', fail);
  viewer.addEventListener('load', () => {
    stage.dataset.state = 'ready';
    status.textContent = '';
    buttons.forEach(button => { button.disabled = false; });
  });
  viewer.addEventListener('progress', event => {
    if (stage.dataset.state !== 'loading') return;
    const percent = Math.min(99, Math.round(event.detail.totalProgress * 100));
    status.textContent = zh ? `正在載入 3D · ${percent}%` : `Loading 3D · ${percent}%`;
  });
  for (const button of buttons) button.addEventListener('click', () => {
    if (button.dataset.action === 'reset') {
      viewer.cameraOrbit = initial.orbit;
      viewer.cameraTarget = initial.target;
      viewer.fieldOfView = initial.fov;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) viewer.jumpCameraToGoal();
    } else {
      viewer.zoom(button.dataset.action === 'in' ? 1 : -1);
    }
  });
  figure.kioskLoadFailed = fail;
}

try {
  await import('./vendor/model-viewer.min.js');
} catch {
  figures.forEach(figure => figure.kioskLoadFailed());
}
