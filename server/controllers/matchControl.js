import admin from "firebase-admin";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const db = admin.firestore();

/* Hugging Face Model */

const HF_API_URL =
  "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";

const HF_API_KEY = process.env.HF_API_KEY;

/* Fetch lost items of the user */

async function getUserLostItems(userId) {
  const snapshot = await db
    .collection("reportedItems")
    .where("userId", "==", userId)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* Fetch all found items */

async function getAllFoundItems() {
  const snapshot = await db.collection("foundItems").get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* Get similarity score from HuggingFace */

async function getSimilarity(sentence1, sentence2) {
  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: {
          source_sentence: sentence1,
          sentences: [sentence2],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data) return null;

    const score = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    return score;
  } catch (error) {
    console.error("HF similarity error:", error.message);
    return null;
  }
}

/* Distance calculation using Haversine formula */

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = deg => deg * (Math.PI / 180);

  const R = 6371;

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

/* Main matching function */

async function matchUserItems(userId) {

  const lostItems = await getUserLostItems(userId);
  const foundItems = await getAllFoundItems();

  const results = [];

  for (const lost of lostItems) {

    const matches = [];

    for (const found of foundItems) {

      if (
        !lost.description ||
        !found.description ||
        !lost.location ||
        !found.location
      )
        continue;

      /* Description similarity */

      const similarity = await getSimilarity(
        lost.description,
        found.description
      );

      if (!similarity || similarity < 0.5) continue;

      /* Distance calculation */

      const distance = haversineDistance(
        lost.location.lat,
        lost.location.lng,
        found.location.lat,
        found.location.lng
      );

      /* Campus radius filter */

      if (distance > 1) continue;

      const normalizedDistance = distance / 1;

      /* Final score */

      const finalScore =
        0.7 * similarity + 0.3 * (1 - normalizedDistance);

      matches.push({
        foundItem: found,
        similarity: finalScore,
      });
    }

    /* Sort matches */

    matches.sort((a, b) => b.similarity - a.similarity);

    results.push({
      lostItem: lost,
      topMatches: matches.slice(0, 3),
    });
  }

  return results;
}

export { matchUserItems };