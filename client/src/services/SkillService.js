/**
 * Domain-specific service for skills-related operations
 */
import ApiService from "./ApiService";

export class SkillService {
  async getSkills(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.category) {
      queryParams.append("category", filters.category);
    }

    const endpoint = `/api/skills${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
    return await ApiService.get(endpoint);
  }

  async createSkill(skillData) {
    return await ApiService.post("/admin/skills", skillData);
  }

  async updateSkill(id, skillData) {
    return await ApiService.put(`/admin/skills/${id}`, skillData);
  }

  async deleteSkill(id) {
    return await ApiService.delete(`/admin/skills/${id}`);
  }
}

export default new SkillService();
