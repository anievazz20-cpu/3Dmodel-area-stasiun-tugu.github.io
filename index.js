// main.js

import { accessToken } from "./js/CesiumConfig.js";
import { data } from "./js/data.js";
import { createSelectElement } from "./js/DropDown.js";
import { chooseAndLoadData } from "./js/cesiumdataselect.js";

Cesium.Ion.defaultAccessToken = accessToken;

const viewer = new Cesium.Viewer('cesiumContainer', {
    terrain: Cesium.EllipsoidTerrainProvider(),
});

// Kamera otomatis nengok lurus ke bawah
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(110.362000, -7.790500, 2500),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
    }
});

// ========================================================
// 1. LOAD DATA VEKTOR TETAP (SUNGAI, JALAN, POHON)
// ========================================================

// A. SUNGAI (Di-load paling pertama agar posisinya paling bawah)
const sungaiUrl = './data/sungaifiks.geojson';
const sungaiDataSource = await Cesium.GeoJsonDataSource.load(sungaiUrl, {
    stroke: Cesium.Color.BLUE,                  // Garis tepi biru
    fill: Cesium.Color.BLUE.withAlpha(0.7),     // Warna dalam biru air
    strokeWidth: 4,
    clampToGround: true                         // Nempel tanah
});
viewer.dataSources.add(sungaiDataSource);

// B. JALAN (UBAH: Menjadi Hitam Murni)
const geojsonUrl = './data/jln.geojson';
const geojsonDataSource = await Cesium.GeoJsonDataSource.load(geojsonUrl, {
    stroke: Cesium.Color.BLACK,                 // Garis tepi hitam
    fill: Cesium.Color.BLACK.withAlpha(0.8),    // Warna dalam hitam aspal agak solid
    strokeWidth: 3,
    clampToGround: true                         // Nempel tanah
});
viewer.dataSources.add(geojsonDataSource);

// C. POHON (UBAH: Menjadi Hijau)
const pohon = './data/pohonfiks.geojson';
const pohonSource = await Cesium.GeoJsonDataSource.load(pohon, {
    markerColor: Cesium.Color.GREEN,            // Penanda diubah jadi HIJAU
    markerSize: 15,
    markerSymbol: 'circle',  
});
viewer.dataSources.add(pohonSource);


// ========================================================
// 2. LOGIKA DROPDOWN / SELECT ELEMENT (HANYA BOLEH SEKALI)
// ========================================================
const options = Object.values(data).map((dataObject, index) => ({
    value: index,
    textContent: dataObject.tipeData
}));

const dropdown = createSelectElement(options, "toolbar");

let activeLayer = {
    layer: null,
    type: null
};

function removeActiveLayer() {
    if (activeLayer.layer) {
        if (activeLayer.type === '3d-tileset') {
            viewer.scene.primitives.remove(activeLayer.layer);
        } else if (activeLayer.type === 'geojson') {
            viewer.dataSources.remove(activeLayer.layer);
        }
        activeLayer.layer = null;
        activeLayer.type = null;
    }
}

async function loadInitialData() {
    const initialData = Object.values(data)[0]; // Ambil data pertama
    activeLayer.layer = await chooseAndLoadData(viewer, initialData);
    activeLayer.type = initialData.type;
}

// Jalankan load data awal
loadInitialData();

// Event listener saat dropdown diubah fungsinya
if (dropdown) {
    dropdown.addEventListener("change", async (event) => {
        removeActiveLayer();
        const selectedIndex = event.target.value;
        const selectedData = Object.values(data)[selectedIndex];

        activeLayer.layer = await chooseAndLoadData(viewer, selectedData);
        activeLayer.type = selectedData.type;
    });
}

// D. TAMBAHKAN REL KERETA API (3D TILES FROM ION)
try {
    const relTileset = await Cesium.Cesium3DTileset.fromIonAssetId(4959951);
    viewer.scene.primitives.add(relTileset);
    console.log("Rel kereta api berhasil dimuat!");
    
    // Opsi tambahan: Jika rel keretanya nanti agak melayang/amblas, 
    // kita bisa turunin pakai modelMatrix seperti LOD 2 kemarin di sini.
} catch (error) {
    console.error("Gagal memuat data rel kereta:", error);
}