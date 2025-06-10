import User from "@/models/userModel"; // Adjust path if needed
import { GoogleTokenPayload } from "@/types/auth"; // Move the type from the controller to a shared file

/**
 * Find a user by email in the database.
 */
export const findUser = async (email: string) => {
  return await User.findOne({ email });
};

/**
 * Create a new user from Google payload.
 */
export const createUser = async (payload: GoogleTokenPayload) => {
  const user = new User({
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  });
  await user.save();
  return user;
};
export default { findUser, createUser };