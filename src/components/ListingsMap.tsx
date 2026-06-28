"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { Listing } from "@/types";
import { useT } from "@/lib/locale-store";
import { formatPriceShort, getDemolitionColor } from "@/lib/utils";

let leafletLoaded = false;

export function ListingsMap({
  listings,
  height = "100%",
  center,
  zoom = 11,
}: {
  listings: Listing[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const markersLayer = useRef<LayerGroup | null>(null);
  const { t, locale } = useT();

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = await import("leaflet");
      if (!leafletLoaded) {
        // @ts-expect-error - leaflet icon fix for bundlers
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
        leafletLoaded = true;
      }

      if (cancelled || !mapRef.current) return;

      if (!mapInstance.current) {
        mapInstance.current = L.map(mapRef.current, {
          zoomControl: true,
        }).setView(center || [41.3111, 69.2797], zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; OpenStreetMap',
          maxZoom: 19,
        }).addTo(mapInstance.current);

        markersLayer.current = L.layerGroup().addTo(mapInstance.current);
      }

      if (!markersLayer.current) return;
      const layerGroup = markersLayer.current;
      layerGroup.clearLayers();

      listings.forEach((listing) => {
        const markerColor = getDemolitionColor(listing.demolitionStatus);
        const houseIcon = L.divIcon({
          className: "",
          html: `<div style="background:${markerColor};width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        const marker = L.marker([listing.lat, listing.lng], { icon: houseIcon });
        const statusLabel =
          listing.demolitionStatus === "safe" ? t.listing.demolitionSafe :
          listing.demolitionStatus === "soon" ? t.listing.demolitionSoon :
          t.listing.demolitionUnknown;
        const popupHtml = `
          <div style="font-family:var(--font-sans),sans-serif;min-width:180px">
            <p style="font-weight:600;font-size:13px;margin:0 0 4px;color:#211712">${listing.title[locale]}</p>
            <p style="font-size:12px;color:#4A3F37;margin:0 0 6px">${listing.district}</p>
            <p style="font-size:11px;font-weight:600;margin:0 0 6px;color:${markerColor}">● ${statusLabel}</p>
            <p style="font-weight:700;font-size:14px;margin:0;color:#C75D3A">${formatPriceShort(listing.price)}${listing.purpose === "rent" ? t.listing.perMonth : ""}</p>
            <a href="/listings/${listing.id}" style="display:inline-block;margin-top:8px;font-size:12px;font-weight:600;color:#3F5C4E;text-decoration:underline">${t.listing.viewDetails}</a>
          </div>
        `;
        marker.bindPopup(popupHtml);
        marker.addTo(layerGroup);

        // Show nearby places around this listing (only meaningful when viewing 1-2 listings, e.g. detail page)
        if (listing.nearbyPlaces && listing.nearbyPlaces.length > 0 && typeof listing.nearbyPlaces[0]?.lat === "number") {
          listing.nearbyPlaces.forEach((place) => {
            if (typeof place.lat !== "number" || typeof place.lng !== "number") return;
            const placeIcon = L.divIcon({
              className: "",
              html: `<div style="background:#3F5C4E;width:10px;height:10px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
              iconSize: [14, 14],
              iconAnchor: [7, 7],
            });
            const placeMarker = L.marker([place.lat, place.lng], { icon: placeIcon });
            placeMarker.bindPopup(
              `<div style="font-family:var(--font-sans),sans-serif"><p style="font-weight:600;font-size:12px;margin:0;color:#211712">${place.name}</p>${place.distance ? `<p style="font-size:11px;color:#4A3F37;margin:2px 0 0">${place.distance}</p>` : ""}</div>`
            );
            placeMarker.addTo(layerGroup);
          });
        }
      });

      if (listings.length > 0 && !center) {
        const bounds = L.latLngBounds(listings.map((l) => [l.lat, l.lng]));
        mapInstance.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [listings, locale]);

  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-2xl overflow-hidden" />;
}
