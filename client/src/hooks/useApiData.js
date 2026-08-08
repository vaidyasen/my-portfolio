/**
 * Custom hooks for data fetching with consistent patterns
 * Follows Single Responsibility and Interface Segregation principles
 */
import { useState, useEffect, useCallback, useRef } from "react";
import ProjectService from "../services/ProjectService";
import SkillService from "../services/SkillService";

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
  const apiCallRef = useRef(apiCall);
  apiCallRef.current = apiCall;
  const dependencyKey = JSON.stringify(dependencies);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiCallRef.current();

      if (!result) {
        return;
      }

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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, dependencyKey]);

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
  return useApiData(
    () => ProjectService.getProjects(filters),
    [JSON.stringify(filters)],
    []
  );
};

/**
 * Hook for skills data
 */
export const useSkills = (filters = {}) => {
  return useApiData(
    () => SkillService.getSkills(filters),
    [JSON.stringify(filters)],
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
