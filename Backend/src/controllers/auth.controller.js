import { createUser, loginUser } from "../services/auth.service.js";
import { generateToken } from "../utils/generateToken.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters");
    }

    const user = await createUser({ name, email, password });

    const { password: _, ...safeUser } = user;

    res
      .status(201)
      .json(new ApiResponse(201, safeUser, "User registered successfully"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await loginUser({ email, password });

    const token = generateToken(user);

    const { password: _, ...safeUser } = user;

    res.json(
      new ApiResponse(200, { user: safeUser, token }, "Login successful")
    );
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};