<script setup>
import { ref, onMounted } from "vue";
import { jwtDecode } from "jwt-decode";
import AuthServices from "../services/authServices";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";
import userRoleServices from "../services/userRoleServices.js";
import userProfileServices from "../services/userProfileServices.js"; // Assuming you have this service

const router = useRouter();
const fName = ref("");
const lName = ref("");
const user = ref({});
const profilePhoto = ref(""); // To store the profile photo URL

const loginWithGoogle = () => {
  window.handleCredentialResponse = handleCredentialResponse;
  const client = import.meta.env.VITE_APP_CLIENT_ID;
  window.google.accounts.id.initialize({
    client_id: client,
    cancel_on_tap_outside: false,
    auto_select: true,
    callback: window.handleCredentialResponse,
  });
  window.google.accounts.id.renderButton(document.getElementById("parent_id"), {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signup_with",
    width: 350,
  });
};

const handleCredentialResponse = async (response) => {
  const decodedToken = jwtDecode(response.credential);
  profilePhoto.value = decodedToken.picture;

  let token = {
    credential: response.credential,
  };

  try {
    const loginResponse = await AuthServices.loginUser(token);
    user.value = loginResponse.data;
    user.value.profilePhoto = profilePhoto.value;
    Utils.setStore("user", user.value);

    // Attempt to get the existing profile
    try {
      const existingProfile = await userProfileServices.getUserProfile(user.value.userId);
      if (!existingProfile) {
        await createUserProfile(); // Call to createUserProfile
      } else {
      }
    } catch (profileError) {
      console.error("Error fetching user profile:", profileError);
      // Attempt to create a new profile regardless of the fetch error
      await createUserProfile();
    }

    router.push({ name: "resumes" });
    fName.value = user.value.fName;
    lName.value = user.value.lName;

  } catch (error) {
    console.error("Error during login:", error);
  }
};

const createUserProfile = async () => {
  try {
    await userProfileServices.createUserProfile({
      userId: user.value.userId,
      fName: user.value.fName,
      lName: user.value.lName,
      phoneNum: user.value.phoneNum,
      profilePhoto: user.value.profilePhoto,
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
};

onMounted(() => {
  loginWithGoogle();
});
</script>

<template>
  <div class="signup-buttons">
    <v-row justify="center">
      <div display="flex" id="parent_id"></div>
    </v-row>
    <!-- Display the profile photo if available -->
    <v-row justify="center" v-if="profilePhoto">
      <v-img :src="profilePhoto" max-width="150" max-height="150" />
    </v-row>
  </div>
</template>
