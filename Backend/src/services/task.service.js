import prisma from "../db/prisma.js";

// CREATE TASK
export const createTask = async ({ title, projectId, assignedTo, deadline }) => {
  const task = await prisma.task.create({
    data: {
      title,
      projectId,
      assignedTo,
      deadline: new Date(deadline),
    },
  });

  return task;
};

// GET TASKS FOR USER
export const getTasks = async (userId) => {
  return await prisma.task.findMany({
    where: {
      assignedTo: userId,
    },
    include: {
      project: true,
    },
  });
};

// UPDATE TASK STATUS
export const updateTaskStatus = async (taskId, status) => {
  return await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });
};

// DELETE TASK
export const deleteTask = async (taskId) => {
  return await prisma.task.delete({
    where: { id: taskId },
  });
};