import {
  getSingleUserStartUp,
  getUserStartUpProjects,
  createStartUpProject,
  generateSection,
  getCompleteReport,
  deleteCompleteReport,
} from "../api/api";

export async function getAllUsersRes() {
  const data = await getUserStartUpProjects();
  return data;
}

export async function getSingleUserRes(id) {
  const data = await getSingleUserStartUp(id);
  return data;
}

export async function createStartupRes({ title, idea, industry, country, status }) {
  const data = await createStartUpProject({ title, idea, industry, country, status });
  return data;
}

export async function generateSectionRes(id, path) {
  const data = await generateSection(id, path);
  return data;
}

export async function getCompleteReportRes(id) {
  const data = await getCompleteReport(id);
  return data;
}


export async function deleteUserStartUp(id) {
  const data = await deleteCompleteReport(id)
  return data;
}













