import ApiResponse from "../utils/apiResponse.js";

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "Access denied"));
  }
  next();
};