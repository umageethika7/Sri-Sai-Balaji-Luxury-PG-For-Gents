'use client';

import 'leaflet/dist/leaflet.css';
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  BuildingOffice2Icon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import type { Map as LeafletMap } from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { ADDRESS_FULL, PG_COORDS, PG_LANDMARK, PG_NAME } from '@/data/pgInfo';
import styles from './LocationMap.module.css';

const MAP_TINT = '#3e66bd';

// Navy (#1f3c86) location badge with a white ring, sitting on a softly pulsing #3e66bd halo.
const PIN_HTML = `
  <span class="${styles.halo}"></span>
  <span class="${styles.pin}">
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
    </svg>
  </span>`;

// Shown when the pin is clicked; Leaflet's own × button closes it.
const POPUP_HTML = `
  <p class="${styles.popupTitle}">${PG_NAME}</p>
  <p class="${styles.popupText}">${ADDRESS_FULL}</p>
  <p class="${styles.popupText}">${PG_LANDMARK}</p>`;

export default function LocationMap() {
  const frameRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  // On narrow maps the zoom/fullscreen buttons would cover the popup's × button, so they hide while it's open.
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    let observer: ResizeObserver | undefined;
    let cancelled = false;

    // Leaflet touches `window` on import, so it is loaded only in the browser.
    import('leaflet').then((module) => {
      const L = module.default ?? module;
      const node = containerRef.current;
      if (cancelled || !node) return;

      const map = L.map(node, {
        center: [PG_COORDS.lat, PG_COORDS.lng],
        zoom: 16,
        minZoom: 12,
        // Custom zoom/fullscreen buttons are rendered below; wheel zoom would hijack page scrolling.
        zoomControl: false,
        scrollWheelZoom: false,
      });
      mapRef.current = map;
      map.attributionControl.setPrefix(false);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Brand-blue layer over the tiles. The `color` blend takes only the hue from #3e66bd and keeps each
      // tile's own lightness, so the map stays light (white areas stay white, streets and blocks turn a
      // soft blue). It sits in its own pane between the tiles (z 200) and the marker (z 600), so the pin
      // keeps its true navy.
      const tintPane = map.createPane('tint');
      tintPane.style.zIndex = '250';
      tintPane.style.mixBlendMode = 'color';
      tintPane.style.pointerEvents = 'none';
      L.rectangle(
        [
          [-85, -180],
          [85, 180],
        ],
        { pane: 'tint', stroke: false, fillColor: MAP_TINT, fillOpacity: 0.9, interactive: false },
      ).addTo(map);

      // Clicking the pin toggles the popup; the × button or a click elsewhere on the map closes it.
      // The popup opens *below* the pin (flipped in CSS via `.popup { translate }`), so the floating info
      // card at the top of the map can't cover it. Leaflet's autoPan assumes an above-the-pin popup, so it is
      // off and we nudge the map ourselves if the popup would be cut off.
      const marker = L.marker([PG_COORDS.lat, PG_COORDS.lng], {
        title: PG_NAME,
        alt: PG_NAME,
        icon: L.divIcon({ className: styles.marker, html: PIN_HTML, iconSize: [38, 38], iconAnchor: [19, 19] }),
      })
        .bindPopup(POPUP_HTML, {
          className: styles.popup,
          offset: [0, 0],
          // Never wider than the map itself (phones), so it can always be panned fully into view. These limits
          // apply to the text area, so subtract the popup's side padding (~66px) and a margin.
          maxWidth: Math.min(360, node.clientWidth - 110),
          minWidth: Math.min(260, node.clientWidth - 110),
          autoPan: false,
        })
        .addTo(map);

      marker.on('popupclose', () => setPopupOpen(false));
      marker.on('popupopen', (event) => {
        setPopupOpen(true);
        requestAnimationFrame(() => {
          const popupBox = event.popup.getElement()?.getBoundingClientRect();
          if (!popupBox) return;
          const mapBox = node.getBoundingClientRect();
          const pad = 16;
          let dx = 0;
          let dy = 0;
          if (popupBox.bottom > mapBox.bottom - pad) dy = popupBox.bottom - (mapBox.bottom - pad);
          else if (popupBox.top < mapBox.top + pad) dy = popupBox.top - (mapBox.top + pad);
          if (popupBox.right > mapBox.right - pad) dx = popupBox.right - (mapBox.right - pad);
          else if (popupBox.left < mapBox.left + pad) dx = popupBox.left - (mapBox.left + pad);
          if (dx || dy) map.panBy([dx, dy]);
        });
      });

      observer = new ResizeObserver(() => map.invalidateSize());
      observer.observe(node);
    });

    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      cancelled = true;
      observer?.disconnect();
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else frameRef.current?.requestFullscreen?.();
  };

  return (
    <div ref={frameRef} className={styles.frame}>
      <div ref={containerRef} className={styles.map} role="region" aria-label={`Map showing the location of ${PG_NAME}`} />

      <div className={styles.card}>
        <span className={styles.cardIcon}>
          <BuildingOffice2Icon className={styles.cardIconSvg} aria-hidden="true" />
        </span>
        <div className={styles.cardText}>
          <p className={styles.cardName}>{PG_NAME}</p>
          <p className={styles.cardLine}>Your home in BTM Layout 2nd Stage, Bengaluru.</p>
        </div>
      </div>

      <div className={`${styles.controls} ${popupOpen ? styles.controlsHidden : ''}`}>
        <button
          type="button"
          className={`${styles.control} ${styles.single}`}
          onClick={toggleFullscreen}
          aria-label={fullscreen ? 'Exit full screen' : 'View map full screen'}
        >
          {fullscreen ? (
            <ArrowsPointingInIcon className={styles.controlIcon} aria-hidden="true" />
          ) : (
            <ArrowsPointingOutIcon className={styles.controlIcon} aria-hidden="true" />
          )}
        </button>
        <div className={styles.zoomGroup}>
          <button type="button" className={styles.control} onClick={() => mapRef.current?.zoomIn()} aria-label="Zoom in">
            <PlusIcon className={styles.controlIcon} aria-hidden="true" />
          </button>
          <button type="button" className={styles.control} onClick={() => mapRef.current?.zoomOut()} aria-label="Zoom out">
            <MinusIcon className={styles.controlIcon} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
