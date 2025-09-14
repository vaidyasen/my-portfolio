// Mock axios to prevent ApiService initialization issues
jest.mock("axios", () => ({
  create: jest.fn(),
  default: {
    create: jest.fn(),
  },
}));

// Mock logger
jest.mock("../utils/logger", () => ({
  apiLogger: {
    log: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock ApiService before importing
jest.mock("../services/ApiService");

import SkillService, {
  SkillService as SkillServiceClass,
} from "../services/SkillService";
import ApiService from "../services/ApiService";

const mockedApiService = ApiService;

describe("SkillService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSkills", () => {
    it("should get skills without filters", async () => {
      const mockResponse = { success: true, data: [] };
      mockedApiService.get.mockResolvedValue(mockResponse);

      const result = await SkillService.getSkills();

      expect(mockedApiService.get).toHaveBeenCalledWith("/api/skills");
      expect(result).toBe(mockResponse);
    });

    it("should get skills by category", async () => {
      const mockResponse = { success: true, data: [] };
      mockedApiService.get.mockResolvedValue(mockResponse);

      const result = await SkillService.getSkills({ category: "frontend" });

      expect(mockedApiService.get).toHaveBeenCalledWith(
        "/api/skills?category=frontend"
      );
      expect(result).toBe(mockResponse);
    });

    it("should handle empty filters object", async () => {
      const mockResponse = { success: true, data: [] };
      mockedApiService.get.mockResolvedValue(mockResponse);

      const result = await SkillService.getSkills({});

      expect(mockedApiService.get).toHaveBeenCalledWith("/api/skills");
      expect(result).toBe(mockResponse);
    });
  });

  describe("getAdminSkills", () => {
    it("should get admin skills without filters", async () => {
      const mockResponse = { success: true, data: [] };
      mockedApiService.get.mockResolvedValue(mockResponse);

      const result = await SkillService.getAdminSkills();

      expect(mockedApiService.get).toHaveBeenCalledWith("/admin/skills");
      expect(result).toBe(mockResponse);
    });

    it("should get admin skills with search filter", async () => {
      const mockResponse = { success: true, data: [] };
      mockedApiService.get.mockResolvedValue(mockResponse);

      const result = await SkillService.getAdminSkills({ search: "react" });

      expect(mockedApiService.get).toHaveBeenCalledWith(
        "/admin/skills?search=react"
      );
      expect(result).toBe(mockResponse);
    });

    it("should get admin skills with category filter", async () => {
      const mockResponse = { success: true, data: [] };
      mockedApiService.get.mockResolvedValue(mockResponse);

      const result = await SkillService.getAdminSkills({ category: "backend" });

      expect(mockedApiService.get).toHaveBeenCalledWith(
        "/admin/skills?category=backend"
      );
      expect(result).toBe(mockResponse);
    });

    it("should get admin skills with multiple filters", async () => {
      const mockResponse = { success: true, data: [] };
      mockedApiService.get.mockResolvedValue(mockResponse);

      const result = await SkillService.getAdminSkills({
        search: "javascript",
        category: "frontend",
      });

      expect(mockedApiService.get).toHaveBeenCalledWith(
        "/admin/skills?search=javascript&category=frontend"
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe("createSkill", () => {
    it("should create a new skill", async () => {
      const skillData = {
        name: "React",
        category: "frontend",
        proficiency: 90,
      };
      const mockResponse = { success: true, data: { id: 1, ...skillData } };
      mockedApiService.post.mockResolvedValue(mockResponse);

      const result = await SkillService.createSkill(skillData);

      expect(mockedApiService.post).toHaveBeenCalledWith(
        "/admin/skills",
        skillData
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe("updateSkill", () => {
    it("should update an existing skill", async () => {
      const skillData = {
        name: "React",
        category: "frontend",
        proficiency: 95,
      };
      const mockResponse = { success: true, data: { id: 1, ...skillData } };
      mockedApiService.put.mockResolvedValue(mockResponse);

      const result = await SkillService.updateSkill(1, skillData);

      expect(mockedApiService.put).toHaveBeenCalledWith(
        "/admin/skills/1",
        skillData
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe("deleteSkill", () => {
    it("should delete a skill", async () => {
      const mockResponse = { success: true, message: "Skill deleted" };
      mockedApiService.delete.mockResolvedValue(mockResponse);

      const result = await SkillService.deleteSkill(1);

      expect(mockedApiService.delete).toHaveBeenCalledWith("/admin/skills/1");
      expect(result).toBe(mockResponse);
    });
  });

  describe("SkillService class instantiation", () => {
    it("should be able to create new instance", () => {
      const skillService = new SkillServiceClass();
      expect(skillService).toBeInstanceOf(SkillServiceClass);
    });
  });
});
