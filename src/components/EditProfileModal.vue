<script setup>
import { ref, defineEmits, watch } from "vue";
import { useEditProfileModalStore } from "../store/editProfileModal.store";
import { storeToRefs } from "pinia";
import Utils from "../config/utils";
import userProfileServices from "../services/userProfileServices";

const editProfileModalStore = useEditProfileModalStore();
const { isVisible } = storeToRefs(editProfileModalStore);

const profilePhoto = ref("");
const emit = defineEmits(["profileUpdated"]);
const item = ref({});
const errorMsg = ref("");
const loading = ref(true);
const user = Utils.getStore("user");

const showEditOverlay = ref(false);
const editPhotoDialog = ref(false);
const newProfilePhoto = ref("");

const fetchUserProfile = async () => {
  loading.value = true;
  if (user) {
    try {
      const response = await userProfileServices.getUserProfile(user.userId);
      if (response) {
        item.value = response;
      } else {
        errorMsg.value = "User profile not found.";
      }
    } catch (error) {
      errorMsg.value = "An error occurred while fetching the profile. Please try again.";
    } finally {
      loading.value = false;
    }
  } else {
    errorMsg.value = "No user data found.";
    loading.value = false;
  }

  profilePhoto.value = item.value.profilePhoto || "";
};

const isValidPhotoUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
};

const getInitials = (firstName, lastName) => {
  const initials = (firstName[0] || '') + (lastName[0] || '');
  return initials.toUpperCase();
};

const submitForm = async () => {
  if (!item.value.fName || !item.value.lName) {
    errorMsg.value = "Please fill in all required fields.";
    return;
  }

  const updatedProfile = {
    ...item.value,
    profilePhoto: profilePhoto.value
  };

  try {
    await userProfileServices.updateUserProfile(user.userId, updatedProfile);
    emit("profileUpdated", updatedProfile);
    errorMsg.value = "";
    editProfileModalStore.close();
  } catch (error) {
    errorMsg.value = "An error occurred while updating the profile. Please try again.";
  }
};

const closeDialog = () => {
  editProfileModalStore.close();
};

const openEditPhotoDialog = () => {
  newProfilePhoto.value = profilePhoto.value;
  editPhotoDialog.value = true;
};

const updateProfilePhoto = () => {
  profilePhoto.value = newProfilePhoto.value || ""; // Allow empty URL
  editPhotoDialog.value = false;
};

const closeEditPhotoDialog = () => {
  editPhotoDialog.value = false;
};

watch(isVisible, (newValue) => {
  if (newValue) {
    fetchUserProfile();
  }
});
</script>

<template>
  <v-dialog v-model="isVisible" max-width="600px">
    <div style="border-radius: 20px;">
      <v-card class="editProfile-modal rounded-md">
        <v-card-text>
          <div class="profile-header">
            <div class="profile-picture" @mouseover="showEditOverlay = true" @mouseleave="showEditOverlay = false">
              <v-avatar color="secondary" class="profile-initials-avatar">
                <template v-if="loading">
                  <v-skeleton-loader class="profile-photo" />
                </template>
                <template v-else>
                  <template v-if="isValidPhotoUrl(profilePhoto)">
                    <img :src="profilePhoto" alt="Profile Photo" class="profile-photo" />
                  </template>
                  <template v-else>
                    <span class="accent--text font-weight-bold" style="font-size: 60px;">
                      {{ getInitials(item.fName, item.lName) || 'NA' }}
                    </span>
                  </template>
                </template>
              </v-avatar>
              <div v-if="showEditOverlay" class="edit-overlay">
                <button @click="openEditPhotoDialog">Edit Photo</button>
              </div>
            </div>
            <p class="email">{{ user.email }}</p>
          </div>

          <div class="form-wrapper">
            <Vueform
              size="md"
              :endpoint="false"
              @submit="submitForm"
              :display-errors="false"
              v-model="item"
              sync
            >
              <TextElement
                name="fName"
                before="First Name"
                :rules="['required']"
                v-model="item.fName"
                class="name-field"
              />
              <TextElement
                name="lName"
                before="Last Name"
                :rules="['required']"
                v-model="item.lName"
                class="name-field"
              />
              <TextElement
                name="phoneNum"
                before="Phone Number"
                v-model="item.phoneNum"
                type="text"
              />
              <StaticElement name="errormsg" v-if="errorMsg">
                <span style="color: red">{{ errorMsg }}</span>
              </StaticElement>
              <GroupElement name="button_container" style="margin-bottom: 5%;">
                <ButtonElement
                  secondary
                  name="cancel"
                  :submits="false"
                  button-label="Cancel"
                  :full="true"
                  size="md"
                  :columns="{
                    container: 6,
                    label: 12,
                    wrapper: 12
                  }"
                  @click="closeDialog"
                />
                <ButtonElement
                  name="submit"
                  :submits="true"
                  button-label="Save"
                  :full="true"
                  size="md"
                  style="background-color: #F9C633; color: white;"
                  :columns="{
                    container: 6,
                    label: 12,
                    wrapper: 12
                  }"
                />
              </GroupElement>
            </Vueform>

            <!-- Edit Photo Dialog -->
            <v-dialog v-model="editPhotoDialog" max-width="300px">
              <v-card>
                <v-card-title>Edit Profile Photo</v-card-title>
                <v-card-text>
                  <v-text-field clearable v-model="newProfilePhoto" label="Photo URL" />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn @click="updateProfilePhoto">Save</v-btn>
                  <v-btn @click="closeEditPhotoDialog">Cancel</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>


<style scoped>
.editProfile-modal {
  border-radius: 16px;
}
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  margin-top: 20px;
}
.profile-picture {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
}
.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.profile-initials-avatar {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  border-radius: 50%;
}
.email {
  font-size: 1rem;
  color: #555;
  margin-top: 10px;
}
.edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 50%;
}
</style>