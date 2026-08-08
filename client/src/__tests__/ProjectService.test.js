// Mock axios to prevent ApiService initialization issues
import ProjectService, {
  ProjectService as ProjectServiceClass,
} from "../services/ProjectService";
import ApiService from "../services/ApiService";

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
jest.mock("../services/ApiService", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApiService = ApiService;

describe("ProjectService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProjects", () => {
    it("should get projects without filters", async () => {
      const mockResponse = { success: true, data: [] };
      mockedApiService.get.mockResolvedValue(mockResponse);

      const result = await ProjectService.getProjects();

      expect(mockedApiService.get).toHaveBeenCalledWith("/api/projects");
      expect(result).toBe(mockResponse);
    });

    it("should get featured projects", async () => {
      const mockResponse = { success: true, data: [] };
      mockedApiService.get.mockResolvedValue(mockResponse);

      const result = await ProjectService.getProjects({ featured: true });

      expect(mockedApiService.get).toHaveBeenCalledWith(
        "/api/projects?featured=true"
      );
      expect(result).toBe(mockResponse);
    });

    it("should get projects by category", async () => {
      const mockResponse = { success: true, data: [] };
      mockedApiService.get.mockResolvedValue(mockResponse);

      const result = await ProjectService.getProjects({ category: "web" });

      expect(mockedApiService.get).toHaveBeenCalledWith(
        "/api/projects?category=web"
      );
      expect(result).toBe(mockResponse);
    });

    it("should get projects with multiple filters", async () => {
      const mockResponse = { success: true, data: [] };
      mockedApiService.get.mockResolvedValue(mockResponse);

      const result = await ProjectService.getProjects({
        featured: true,
        category: "mobile",
      });

      expect(mockedApiService.get).toHaveBeenCalledWith(
        "/api/projects?featured=true&category=mobile"
      );
      expect(result).toBe(mockResponse);
    });

    it("should handle empty filters object", async () => {
      const mockResponse = { success: true, data: [] };
      mockedApiService.get.mockResolvedValue(mockResponse);

      const result = await ProjectService.getProjects({});

      expect(mockedApiService.get).toHaveBeenCalledWith("/api/projects");
      expect(result).toBe(mockResponse);
    });
  });

  describe("getProjectById", () => {
    it("should get project by id", async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, title: "Test Project" },
      };
      mockedApiService.get.mockResolvedValue(mockResponse);

      const result = await ProjectService.getProjectById(1);

      expect(mockedApiService.get).toHaveBeenCalledWith("/api/projects/1");
      expect(result).toBe(mockResponse);
    });

    it("should handle string id", async () => {
      const mockResponse = {
        success: true,
        data: { id: "1", title: "Test Project" },
      };
      mockedApiService.get.mockResolvedValue(mockResponse);

      const result = await ProjectService.getProjectById("1");

      expect(mockedApiService.get).toHaveBeenCalledWith("/api/projects/1");
      expect(result).toBe(mockResponse);
    });
  });

  describe("createProject", () => {
    it("should create a new project", async () => {
      const projectData = {
        title: "New Project",
        description: "A new project",
        technologies: ["React", "Node.js"],
      };
      const mockResponse = { success: true, data: { id: 1, ...projectData } };
      mockedApiService.post.mockResolvedValue(mockResponse);

      const result = await ProjectService.createProject(projectData);

      expect(mockedApiService.post).toHaveBeenCalledWith(
        "/admin/projects",
        projectData
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe("updateProject", () => {
    it("should update an existing project", async () => {
      const projectData = {
        title: "Updated Project",
        description: "An updated project",
      };
      const mockResponse = { success: true, data: { id: 1, ...projectData } };
      mockedApiService.put.mockResolvedValue(mockResponse);

      const result = await ProjectService.updateProject(1, projectData);

      expect(mockedApiService.put).toHaveBeenCalledWith(
        "/admin/projects/1",
        projectData
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe("deleteProject", () => {
    it("should delete a project", async () => {
      const mockResponse = { success: true, message: "Project deleted" };
      mockedApiService.delete.mockResolvedValue(mockResponse);

      const result = await ProjectService.deleteProject(1);

      expect(mockedApiService.delete).toHaveBeenCalledWith("/admin/projects/1");
      expect(result).toBe(mockResponse);
    });
  });

  describe("refreshDatabase", () => {
    it("should refresh the database", async () => {
      const mockResponse = { success: true, message: "Database refreshed" };
      mockedApiService.post.mockResolvedValue(mockResponse);

      const result = await ProjectService.refreshDatabase();

      expect(mockedApiService.post).toHaveBeenCalledWith(
        "/admin/projects/refresh"
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe("ProjectService class instantiation", () => {
    it("should be able to create new instance", () => {
      const projectService = new ProjectServiceClass();
      expect(projectService).toBeInstanceOf(ProjectServiceClass);
    });
  });
});
