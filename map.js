/* global L */
// Карта мира: плитки нарезаны из рендера uNmINeD. Координаты как в игре: долгота = X блока, широта = −Z блока.
// Края мира: X от −9088 до 9088, Z от −6016 до 6016. Зум 0 — один пиксель = один блок.
if (window.top !== window.self) {
  document.body.textContent = 'Официальная карта: https://dvizhuha-mc.github.io/map/';
  throw new Error('framed');
}

const X0 = -9088, X1 = 9088, Z0 = -6016, Z1 = 6016;
const bounds = L.latLngBounds([[-Z1, X0], [-Z0, X1]]);

const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -7,
  maxZoom: 3,
  zoomSnap: 0.5,
  maxBounds: bounds.pad(0.25),
  maxBoundsViscosity: 0.8,
  attributionControl: true,
});
map.attributionControl.setPrefix('');
map.attributionControl.addAttribution('Рендер: uNmINeD · Карта: Leaflet');

L.tileLayer('tiles/{z}/{x}/{y}.webp', {
  tileSize: 256,
  minZoom: -7,
  maxZoom: 3,
  minNativeZoom: -7,
  maxNativeZoom: 0,
  bounds,
  noWrap: true,
  errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
}).addTo(map);

map.fitBounds(bounds);

const coords = document.getElementById('coords');
map.on('mousemove', (e) => {
  const x = Math.floor(e.latlng.lng);
  const z = Math.floor(-e.latlng.lat);
  coords.textContent = x < X0 || x >= X1 || z < Z0 || z >= Z1 ? 'за краем мира' : `X ${x} · Z ${z}`;
});
map.on('mouseout', () => { coords.textContent = 'наведи на карту'; });

// Ссылка вида /map/#x=100&z=-200&zoom=0 открывает карту в нужном месте.
function fromHash() {
  const p = new URLSearchParams(location.hash.slice(1));
  const x = Number(p.get('x')), z = Number(p.get('z'));
  if (p.has('x') && p.has('z') && Number.isFinite(x) && Number.isFinite(z)) {
    map.setView([-z, x], Number(p.get('zoom')) || -1);
  }
}
fromHash();
window.addEventListener('hashchange', fromHash);
