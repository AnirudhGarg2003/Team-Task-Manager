import prisma from "../db/prisma.js";

// CREATE PROJECT
export const createProject = async ({ name }, userId) => {
  const project = await prisma.project.create({
    data: {
      name,
      createdBy: userId,
      members: {
        connect: { id: userId }
      }
    },
  });

  return project;
};

// ADD MEMBER
export const addMember = async (projectId, userId) => {
  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      members: {
        connect: { id: userId },
      },
    },
  });

  return project;
};

// GET PROJECTS FOR USER
export const getProjects = async (userId, userRole) => {
  if (userRole === "ADMIN") {
    return await prisma.project.findMany({
      include: {
        members: true,
        tasks: true,
      },
    });
  }

  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          id: userId,
        },
      },
    },
    include: {
      members: true,
      tasks: true,
    },
  });

  return projects;
};

// DELETE PROJECT
export const deleteProject = async (projectId) => {
  // First delete associated tasks to prevent foreign key constraint errors
  await prisma.task.deleteMany({
    where: { projectId: projectId }
  });

  // Then delete the project
  const project = await prisma.project.delete({
    where: { id: projectId }
  });

  return project;
};