import express from "express";
import admin from "firebase-admin";

const NearbyRoute = express.Router();
const db = admin.firestore();

/* Haversine distance calculation */

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (deg) => deg * (Math.PI / 180);
  const R = 6371; // Earth radius (km)

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/* Fetch all lost and found items */

async function getAllItems() {
  const reportedSnapshot = await db.collection("reportedItems").get();
  const foundSnapshot = await db.collection("foundItems").get();

  const reportedItems = reportedSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    type: "lost",
  }));

  const foundItems = foundSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    type: "found",
  }));

  return [...reportedItems, ...foundItems];
}

/* GET nearby items */

NearbyRoute.get("/items", async (req, res) => {
  try {

    const { latitude, longitude, radius } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: "Latitude and longitude are required",
      });
    }

    const centerLat = parseFloat(latitude);
    const centerLng = parseFloat(longitude);
    const radiusKm = parseFloat(radius) || 20;

    const allItems = await getAllItems();

    const nearbyItems = allItems.filter((item) => {

      if (!item.location?.lat || !item.location?.lng) return false;

      const distance = haversineDistance(
        centerLat,
        centerLng,
        item.location.lat,
        item.location.lng
      );

      return distance <= radiusKm;
    });

    return res.json({
      count: nearbyItems.length,
      items: nearbyItems,
    });

  } catch (error) {
    console.error("Nearby items error:", error);

    res.status(500).json({
      error: "Failed to fetch nearby items",
    });
  }
});

export default NearbyRoute;