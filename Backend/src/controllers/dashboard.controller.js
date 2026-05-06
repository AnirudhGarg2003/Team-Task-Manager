import prisma from "../db/prisma.js";
import ApiResponse from "../utils/apiResponse.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await prisma.task.findMany({
      where: { assignedTo: userId },
    });

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "DONE").length;
    const pending = tasks.filter(t => t.status !== "DONE").length;
    const overdue = tasks.filter(
      t => new Date(t.deadline) < new Date() && t.status !== "DONE"
    ).length;

    res.json(
      new ApiResponse(200, { total, completed, pending, overdue }, "Dashboard fetched")
    );
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, null, error.message));
  }
};