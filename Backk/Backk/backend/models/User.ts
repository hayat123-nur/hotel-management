import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User interface - defines the shape of a User document
 */
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  // Contact & profile fields for hotel project
  contactNumber?: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  avatarUrl?: string;
  password: string;
  role: "guest" | "manager" | "staff" | "admin" | "student";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

/**
 * User Schema
 * Handles user authentication and profile data
 */
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    // Contact fields for hotel users
    contactNumber: {
      type: String,
      trim: true,
      required: false,
    },
    address: {
      line1: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    avatarUrl: {
      type: String,
      trim: true,
      required: false,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ["guest", "manager", "staff", "admin", "student"],
      default: "guest",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

/**
 * Pre-save middleware to hash password before saving to database
 * Only hashes if password is modified
 */
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    console.log("🔐 Hashing password for user:", this.email);

    // Generate salt with 10 rounds
    const salt = await bcrypt.genSalt(10);

    // Hash password
    this.password = await bcrypt.hash(this.password, salt);

    console.log("✅ Password hashed successfully");
    next();
  } catch (error) {
    console.error("❌ Error hashing password:", error);
    next(error as Error);
  }
});

/**
 * Method to compare entered password with hashed password in database
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
userSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error("❌ Error comparing passwords:", error);
    throw error;
  }
};

/**
 * Method to get user object without sensitive data
 * @returns {Object} User object without password
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export { User };
export default User;
