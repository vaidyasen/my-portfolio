/**
 * Custom hooks for data fetching with consistent patterns
 * Follows Single Responsibility and Interface Segregation principles
 */
import { useState, useEffect } from "react";

/**
 * Generic hook for API data fetching
 * @param {Function} apiCall - The API call function
 * @param {Array} dependencies - Dependencies for re-fetching
 * @param {*} initialData - Initial data state
 */
export const useApiData = (apiCall, dependencies = [], initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiCall();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

/**
 * Hook for projects data
 */
export const useProjects = (filters = {}) => {
  const [projectService, setProjectService] = useState(null);

  useEffect(() => {
    import("../services/ProjectService").then((module) => {
      setProjectService(module.default);
    });
  }, []);

  return useApiData(
    () => projectService?.getProjects(filters),
    [projectService, JSON.stringify(filters)],
    []
  );
};

/**
 * Hook for skills data
 */
export const useSkills = (filters = {}) => {
  const [skillService, setSkillService] = useState(null);

  useEffect(() => {
    import("../services/SkillService").then((module) => {
      setSkillService(module.default);
    });
  }, []);

  return useApiData(
    () => skillService?.getSkills(filters),
    [skillService, JSON.stringify(filters)],
    []
  );
};

/**
 * Hook for async operations (create, update, delete)
 */
export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (operation) => {
    try {
      setLoading(true);
      setError(null);

      const result = await operation();

      if (!result.success) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
    error,
    clearError: () => setError(null),
  };
};
