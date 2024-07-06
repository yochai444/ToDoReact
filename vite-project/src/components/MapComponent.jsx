import React, { useRef, useEffect, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM } from "ol/source";
import { Vector as VectorSource } from "ol/source";
import { Draw, Modify, Snap } from "ol/interaction";
import { fromLonLat } from "ol/proj";
import { GeoJSON } from "ol/format";

const MapComponent = ({ onPolygonSelect, selectedPolygon }) => {
  const mapRef = useRef();
  const [map, setMap] = useState();

  useEffect(() => {
    const vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const olMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    const draw = new Draw({
      source: vectorSource,
      type: "Polygon",
    });

    draw.on("drawend", (event) => {
      const geojson = new GeoJSON().writeFeatureObject(event.feature);
      onPolygonSelect(geojson);
    });

    olMap.addInteraction(draw);
    olMap.addInteraction(new Modify({ source: vectorSource }));
    olMap.addInteraction(new Snap({ source: vectorSource }));

    setMap(olMap);

    return () => olMap.setTarget(undefined);
  }, [onPolygonSelect]);

  useEffect(() => {
    if (map && selectedPolygon) {
      const vectorSource = map.getLayers().item(1).getSource();
      vectorSource.clear();

      const format = new GeoJSON();
      const feature = format.readFeature(selectedPolygon, {
        featureProjection: map.getView().getProjection(),
      });
      vectorSource.addFeature(feature);
    }
  }, [map, selectedPolygon]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default MapComponent;
