
async function loadTileset(viewer, ionAssetId) {
    const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(ionAssetId);
    viewer.scene.primitives.add(tileset);
    return tileset;
}

async function loadIonGeoJson(viewer, ionAssetId) {

    const resource = await Cesium.IonResource.fromAssetId(ionAssetId);


    const dataSource = await Cesium.GeoJsonDataSource.load(resource, {
        stroke: Cesium.Color.fromCssColorString('#ffffff'), 
        fill: Cesium.Color.fromCssColorString('#000000').withAlpha(0.7),
        strokeWidth: 4
    });

    await viewer.dataSources.add(dataSource);
    return dataSource;
}

export async function chooseAndLoadData(viewer, dataObject) {
    if (!viewer || !dataObject) return null;

    try {
        if (dataObject.type === "3d-tileset") {
            return await loadTileset(viewer, dataObject.source);
        } else if (dataObject.type === "geojson") {
            return await loadIonGeoJson(viewer, dataObject.source);
        } else {
            console.error("Unknown data type:", dataObject.type);
            return null;
        }
    } catch (error) {
        console.error(`Failed to load data for source: ${dataObject.source}`, error);
        return null;
    }
}