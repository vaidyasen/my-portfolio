import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.github.com/users/ritikvaidyasen/repos")
      .then((res) => {
        const data = res.data.map((repo) => ({
          Title: repo.name,
          Description: repo.description || "No description available.",
        }));
        setProjects(data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-10">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10">
        My Projects
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((proj, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {proj.Title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {proj.Description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
