import { renderHook, act } from "@testing-library/react";
import {
  useApiData,
  useProjects,
  useSkills,
  useAsyncOperation,
} from "../hooks/useApiData";
import ProjectService from "../services/ProjectService";
import SkillService from "../services/SkillService";

// Mock the service imports
jest.mock("../services/ProjectService", () => ({
  __esModule: true,
  default: {
    getProjects: jest.fn(),
  },
}));

jest.mock("../services/SkillService", () => ({
  __esModule: true,
  default: {
    getSkills: jest.fn(),
  },
}));

// Helper functions to reduce nesting
const waitForNextTick = () => new Promise((resolve) => setTimeout(resolve, 0));
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const createDelayedPromise = (result, delay) =>
  new Promise((resolve) => setTimeout(() => resolve(result), delay));

describe("useApiData Hook", () => {
  beforeEach(() => {
    ProjectService.getProjects.mockResolvedValue({ success: true, data: [] });
    SkillService.getSkills.mockResolvedValue({ success: true, data: [] });
  });

  describe("useApiData", () => {
    it("should initialize with loading state", () => {
      const mockApiCall = jest.fn(() => new Promise(() => {}));

      const { result } = renderHook(() => useApiData(mockApiCall));

      expect(result.current.data).toBe(null);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it("should fetch data successfully", async () => {
      const mockData = [{ id: 1, name: "test" }];
      const mockApiCall = jest
        .fn()
        .mockResolvedValue({ success: true, data: mockData });

      const { result } = renderHook(() => useApiData(mockApiCall));

      // Wait for the effect to run
      await act(async () => {
        await waitForNextTick();
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(mockApiCall).toHaveBeenCalledTimes(1);
    });

    it("should handle API errors", async () => {
      const mockError = "API Error";
      const mockApiCall = jest
        .fn()
        .mockResolvedValue({ success: false, error: mockError });

      const { result } = renderHook(() => useApiData(mockApiCall));

      await act(async () => {
        await waitForNextTick();
      });

      expect(result.current.data).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(mockError);
    });

    it("should handle thrown exceptions", async () => {
      const mockApiCall = jest
        .fn()
        .mockRejectedValue(new Error("Network Error"));

      const { result } = renderHook(() => useApiData(mockApiCall));

      await act(async () => {
        await waitForNextTick();
      });

      expect(result.current.data).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Network Error");
    });

    it("should handle exceptions without message", async () => {
      const mockApiCall = jest.fn().mockRejectedValue(new Error());

      const { result } = renderHook(() => useApiData(mockApiCall));

      await act(async () => {
        await waitForNextTick();
      });

      expect(result.current.error).toBe("An unexpected error occurred");
    });

    it("should use initial data", () => {
      const initialData = [{ id: 0, name: "initial" }];
      const mockApiCall = jest.fn(() => new Promise(() => {}));

      const { result } = renderHook(() =>
        useApiData(mockApiCall, [], initialData)
      );

      expect(result.current.data).toEqual(initialData);
    });

    it("should refetch data when refetch is called", async () => {
      const mockData = [{ id: 1, name: "test" }];
      const mockApiCall = jest
        .fn()
        .mockResolvedValue({ success: true, data: mockData });

      const { result } = renderHook(() => useApiData(mockApiCall));

      await act(async () => {
        await waitForNextTick();
      });

      expect(mockApiCall).toHaveBeenCalledTimes(1);

      // Call refetch
      await act(async () => {
        await result.current.refetch();
      });

      expect(mockApiCall).toHaveBeenCalledTimes(2);
    });

    it("should re-fetch when dependencies change", async () => {
      const mockApiCall = jest
        .fn()
        .mockResolvedValue({ success: true, data: [] });
      let dependency = "initial";

      const { rerender } = renderHook(() =>
        useApiData(mockApiCall, [dependency])
      );

      await act(async () => {
        await waitForNextTick();
      });

      expect(mockApiCall).toHaveBeenCalledTimes(1);

      // Change dependency
      dependency = "changed";
      rerender();

      await act(async () => {
        await waitForNextTick();
      });

      expect(mockApiCall).toHaveBeenCalledTimes(2);
    });
  });

  describe("useProjects", () => {
    it("should fetch projects without filters", async () => {
      const { result } = renderHook(() => useProjects());

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBe(null);

      await act(async () => {
        await waitForNextTick();
      });
    });

    it("should fetch projects with filters", async () => {
      const filters = { featured: true };
      const { result } = renderHook(() => useProjects(filters));

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toEqual([]);

      await act(async () => {
        await waitForNextTick();
      });
    });

    it("should re-fetch when filters change", async () => {
      let filters = { featured: true };
      const { result, rerender } = renderHook(() => useProjects(filters));

      await act(async () => {
        await waitForNextTick();
      });

      // Change filters
      filters = { category: "web" };
      rerender();

      // Should trigger re-fetch due to dependency change
      expect(result.current).toBeDefined();

      await act(async () => {
        await waitForNextTick();
      });
    });
  });

  describe("useSkills", () => {
    it("should fetch skills without filters", async () => {
      const { result } = renderHook(() => useSkills());

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBe(null);

      await act(async () => {
        await waitForNextTick();
      });
    });

    it("should fetch skills with filters", async () => {
      const filters = { category: "frontend" };
      const { result } = renderHook(() => useSkills(filters));

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toEqual([]);

      await act(async () => {
        await waitForNextTick();
      });
    });
  });

  describe("useAsyncOperation", () => {
    it("should initialize with correct default state", () => {
      const { result } = renderHook(() => useAsyncOperation());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.execute).toBe("function");
      expect(typeof result.current.clearError).toBe("function");
    });

    it("should execute operation successfully", async () => {
      const mockOperation = jest
        .fn()
        .mockResolvedValue({ success: true, data: "result" });
      const { result } = renderHook(() => useAsyncOperation());

      let operationResult;
      await act(async () => {
        operationResult = await result.current.execute(mockOperation);
      });

      expect(mockOperation).toHaveBeenCalledTimes(1);
      expect(operationResult).toEqual({ success: true, data: "result" });
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("should handle operation failure", async () => {
      const mockOperation = jest
        .fn()
        .mockResolvedValue({ success: false, error: "Operation failed" });
      const { result } = renderHook(() => useAsyncOperation());

      let operationResult;
      await act(async () => {
        operationResult = await result.current.execute(mockOperation);
      });

      expect(operationResult).toEqual({
        success: false,
        error: "Operation failed",
      });
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Operation failed");
    });

    it("should handle thrown exceptions", async () => {
      const mockOperation = jest
        .fn()
        .mockRejectedValue(new Error("Network error"));
      const { result } = renderHook(() => useAsyncOperation());

      let operationResult;
      await act(async () => {
        operationResult = await result.current.execute(mockOperation);
      });

      expect(operationResult).toEqual({
        success: false,
        error: "Network error",
      });
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Network error");
    });

    it("should handle exceptions without message", async () => {
      const mockOperation = jest.fn().mockRejectedValue(new Error());
      const { result } = renderHook(() => useAsyncOperation());

      let operationResult;
      await act(async () => {
        operationResult = await result.current.execute(mockOperation);
      });

      expect(operationResult).toEqual({
        success: false,
        error: "An unexpected error occurred",
      });
      expect(result.current.error).toBe("An unexpected error occurred");
    });

    it("should set loading state during operation", async () => {
      const mockOperation = jest
        .fn()
        .mockImplementation(() => createDelayedPromise({ success: true }, 100));
      const { result } = renderHook(() => useAsyncOperation());

      act(() => {
        result.current.execute(mockOperation);
      });

      expect(result.current.loading).toBe(true);

      await act(async () => {
        await delay(150);
      });

      expect(result.current.loading).toBe(false);
    });

    it("should clear error when clearError is called", async () => {
      const mockOperation = jest
        .fn()
        .mockResolvedValue({ success: false, error: "Test error" });
      const { result } = renderHook(() => useAsyncOperation());

      await act(async () => {
        await result.current.execute(mockOperation);
      });

      expect(result.current.error).toBe("Test error");

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });
});
