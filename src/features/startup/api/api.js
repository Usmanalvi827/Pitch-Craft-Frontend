import { api } from "../../../lib/apiClient";

export async function getUserStartUpProjects() {
  const response = await api.get("api/start-up/projects", {
    headers: { "Cache-Control": "no-cache" },
  });
  return response.data;
}

export async function getSingleUserStartUp(id) {
  const response = await api.get(`api/start-up/projects/${id}`);
  return response.data;
}

export async function createStartUpProject({ title, idea, industry, country, status }) {
  const response = await api.post("api/start-up/projects", {
    title,
    idea,
    industry,
    country,
    status,
  });
  return response.data;
}

// path matches the module's apiPath in startupModules.js, e.g. "generate-overview"
// AI generation genuinely takes longer than the app's normal 10s timeout
// (up to ~60s for landing page / pitch), so this needs its own override
// instead of using the global default meant for fast CRUD/auth calls.
export async function generateSection(id, path) {
  const response = await api.post(`api/projects/${id}/${path}`, null, {
    timeout: 90000,
  });
  return response.data;
}

export async function getCompleteReport(id) {
  const response = await api.get(`api/start-up/projects/${id}/complete-report`, {
    headers: { "Cache-Control": "no-cache" },
  });
  return response.data;
}

// Delete Whole Start-Up Project -->>
export async function deleteCompleteReport (id) {
  const response = await api.delete(`api/start-up/projects/${id}`);
  return response.data;
}