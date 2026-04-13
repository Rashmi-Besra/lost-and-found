import admin from "firebase-admin";

const db = admin.firestore();
const auth = admin.auth();

/* GET USER PROFILE */

export const getUserProfile = async (req, res) => {

  const { userId } = req.params;

  try {

    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const authUser = await auth.getUser(userId);

    const reportedItemsSnap = await db
      .collection("reportedItems")
      .where("userId", "==", userId)
      .get();

    const foundItemsSnap = await db
      .collection("foundItems")
      .where("userId", "==", userId)
      .get();

    const userProfile = {
      fullName: userData.fullName || "",
      rollNumber: userData.rollNumber || "",
      branch: userData.branch || "",
      year: userData.year || "",
      hostelName: userData.hostelName || "",

      email: authUser.email || "",
      phone: userData.phone || "",
      profileImage: userData.profileImage || "",

      reportsCount: reportedItemsSnap.size,
      foundCount: foundItemsSnap.size,
    };

    res.json(userProfile);

  } catch (error) {

    console.error("Error fetching user profile:", error);

    res.status(500).json({
      error: "Error fetching user profile"
    });

  }

};


/* UPDATE USER PROFILE */

export const updateUserProfile = async (req, res) => {

  const { userId } = req.params;

  const {
    fullName,
    rollNumber,
    branch,
    year,
    hostelName,
    phone,
    profileImage,
    email
  } = req.body;

  try {

    const userRef = db.collection("users").doc(userId);

    await userRef.set(
      {
        fullName,
        rollNumber,
        branch,
        year,
        hostelName,
        phone,
        profileImage,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    /* Update email in Firebase Auth if changed */

    if (email) {

      const authUser = await auth.getUser(userId);

      if (authUser.email !== email) {
        await auth.updateUser(userId, { email });
      }

    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        fullName,
        rollNumber,
        branch,
        year,
        hostelName,
        phone,
        profileImage,
        email
      }
    });

  } catch (error) {

    console.error("Error updating profile:", error);

    let errorMessage = "Error updating profile";

    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email is already in use";
    }

    if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address";
    }

    res.status(500).json({
      error: errorMessage,
      details: error.message
    });

  }

};