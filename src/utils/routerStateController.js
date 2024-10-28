import Utils from "../config/utils";
import UserRoleServices from "../services/userRoleServices.js";
import AuthServices from "../services/authServices.js";

export default class RouterStateController {
  async isAuthenticated() {
    const user = Utils.getStore("user");

    // If no user is stored, return false
    if (!user) {
      Utils.setStore("userAuthenticated", false);
      return false;
    }

    try {
      // Always check if the token is valid, regardless of "userAuthenticated"
      const isValidToken = await AuthServices.validateToken(user);
      return isValidToken.data.isValid;
    } catch (error) {
      console.log("Token validation failed:", error);
      return false;
    }
  }
}

// const checkAdminPriviledges = async () => {
//   const user = Utils.getStore("user");

//   const response = await UserRoleServices.getAllRolesForUser(user.userId);
//   const mappedRoles = response.data.map((currentRole) => {
//     return currentRole.role.type;
//   });
//   const userRoles = mappedRoles;

//   if (userRoles.includes("Admin") || userRoles.includes("Director")) {
//     Utils.setStore("userHasCompletedQuestionnare", true);
//     Utils.setStore("userHasSignedForms", true);
//   }
// };
