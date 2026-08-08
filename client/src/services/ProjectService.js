/**
 * Domain-specific service for project-related operations
 * Follows Single Responsibility Principle
 */
import ApiService from "./ApiService";

export class ProjectService {
  async getProjects(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.featured) {
      queryParams.append("featured", "true");
    }
    if (filters.category) {
      queryParams.append("category", filters.category);
    }

    const endpoint = `/api/projects${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
    return await ApiService.get(endpoint);
  }

  async getProjectById(id) {
    return await ApiService.get(`/api/projects/${id}`);
  }

  async createProject(projectData) {
    return await ApiService.post("/admin/projects", projectData);
  }

  async updateProject(id, projectData) {
    return await ApiService.put(`/admin/projects/${id}`, projectData);
  }

  async deleteProject(id) {
    return await ApiService.delete(`/admin/projects/${id}`);
  }

  async refreshDatabase() {
    return await ApiService.post("/admin/projects/refresh");
  }
}

const projectService = new ProjectService();

export default projectService;
