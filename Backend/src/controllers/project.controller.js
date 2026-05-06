import {
  createProject,
  addMember,
  getProjects,
  deleteProject,
} from "../services/project.service.js";
import prisma from "../db/prisma.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

// CREATE PROJECT
export const createProjectController = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new ApiError(400, "Project name is required");
    }

    const project = await createProject({ name }, req.user.id);

    res
      .status(201)
      .json(new ApiResponse(201, project, "Project created"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

// ADD MEMBER
export const addMemberController = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!projectId || !userId) {
      throw new ApiError(400, "projectId and userId are required");
    }

    if (isNaN(projectId) || isNaN(userId)) {
      throw new ApiError(400, "Invalid IDs");
    }

    const projectExists = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });

    if (!projectExists) {
      throw new ApiError(404, "Project not found");
    }

    const userExists = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!userExists) {
      throw new ApiError(404, "User not found");
    }

    const project = await addMember(Number(projectId), Number(userId));

    res.json(new ApiResponse(200, project, "Member added"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

// GET PROJECTS
export const getProjectsController = async (req, res) => {
  try {
    const projects = await getProjects(req.user.id, req.user.role);

    res.json(new ApiResponse(200, projects, "Projects fetched"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, null, error.message));
  }
};

// DELETE PROJECT
export const deleteProjectController = async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    if (isNaN(projectId)) {
      throw new ApiError(400, "Invalid Project ID");
    }

    const projectExists = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!projectExists) {
      throw new ApiError(404, "Project not found");
    }

    await deleteProject(projectId);

    res.json(new ApiResponse(200, null, "Project deleted successfully"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};