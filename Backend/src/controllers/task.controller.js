import {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} from "../services/task.service.js";

import prisma from "../db/prisma.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

// CREATE TASK
export const createTaskController = async (req, res) => {
  try {
    const { title, projectId, assignedTo, deadline } = req.body;

    if (!title || !projectId || !assignedTo || !deadline) {
      throw new ApiError(400, "All fields are required");
    }

    if (isNaN(projectId) || isNaN(assignedTo)) {
      throw new ApiError(400, "Invalid IDs");
    }

    const parsedDate = new Date(deadline);
    if (isNaN(parsedDate)) {
      throw new ApiError(400, "Invalid deadline format");
    }

    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
      include: { members: true },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const userExists = await prisma.user.findUnique({
      where: { id: Number(assignedTo) },
    });

    if (!userExists) {
      throw new ApiError(404, "Assigned user not found");
    }

    const isMember = project.members.some(
      user => user.id === Number(assignedTo)
    );

    if (!isMember) {
      throw new ApiError(400, "User is not a member of this project");
    }

    const task = await createTask({
      title,
      projectId: Number(projectId),
      assignedTo: Number(assignedTo),
      deadline: parsedDate,
    });

    res
      .status(201)
      .json(new ApiResponse(201, task, "Task created"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

// GET TASKS
export const getTasksController = async (req, res) => {
  try {
    const tasks = await getTasks(req.user.id);
    res.json(new ApiResponse(200, tasks, "Tasks fetched"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, null, error.message));
  }
};

// UPDATE STATUS
export const updateTaskController = async (req, res) => {
  try {
    const { status } = req.body;
    const taskId = Number(req.params.id);

    if (!status) {
      throw new ApiError(400, "Status is required");
    }

    const validStatus = ["PENDING", "IN_PROGRESS", "DONE"];

    if (!validStatus.includes(status)) {
      throw new ApiError(400, "Invalid status value");
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const updatedTask = await updateTaskStatus(taskId, status);

    res.json(new ApiResponse(200, updatedTask, "Task updated"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

// DELETE TASK
export const deleteTaskController = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (isNaN(taskId)) {
      throw new ApiError(400, "Invalid Task ID");
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    await deleteTask(taskId);

    res.json(new ApiResponse(200, null, "Task deleted successfully"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};