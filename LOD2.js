// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZTcxYzI3Yy0yYzdjLTQwN2MtYTQ4OS1mNGY4OTIzY2ZmZTQiLCJpZCI6MzEyNTk0LCJpYXQiOjE3NTAwNjY1NTF9.Vp5KCL6-9RRihLE-VsiV2OlJnLeyMOH_FdNpkjMk3wc";

const viewer = new Cesium.Viewer("cesiumContainer", {
   terrainProvider: Cesium.createWorldTerrain(),  // <-- ini bisa dimatikan
    baseLayerPicker: false
});

// Fungsi untuk load tileset
async function loadTileset(assetId) {
  try {
    // Remove all primitives dulu
    viewer.scene.primitives.removeAll();

    const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(assetId, {
      modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(0, 0)
      ),
    });

    viewer.scene.primitives.add(tileset);
    await viewer.zoomTo(tileset);

    // Apply style jika ada
    const extras = tileset.asset.extras;
    if (
      Cesium.defined(extras) &&
      Cesium.defined(extras.ion) &&
      Cesium.defined(extras.ion.defaultStyle)
    ) {
      tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
    }

    console.log("Tileset loaded:", assetId);
  } catch (error) {
    console.error("Error loading tileset:", error);
  }
}

// Load default tileset pertama kali
loadTileset(3488667);

// Event handler untuk dropdown
const selectData = document.getElementById("selectData");
selectData.addEventListener("change", function () {
  const selectedValue = selectData.value;

  if (selectedValue === "1") {
    loadTileset(3488667); // ganti assetId sesuai Building Footprint
  } else if (selectedValue === "2") {
    loadTileset(1234567); // ganti assetId sesuai LOD 1
  } else if (selectedValue === "3") {
    loadTileset(2345678); // ganti assetId sesuai LOD 2
  }
});
