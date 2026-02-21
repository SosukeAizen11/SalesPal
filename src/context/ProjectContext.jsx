import React, { createContext, useContext, useState } from 'react';
import { useProjects } from '../hooks/useProjects';

/**
 * ProjectContext — Thin wrapper over useProjects() Supabase hook.
 * Maintains the same useProject() API for backward compatibility
 * with ProjectsHub, Sidebar, ProjectLayout, etc.
 */
const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
    const { projects, loading, createProject, getProjectById, archiveProject } = useProjects();
    const [activeProject, setActiveProject] = useState(null);

    const addProject = async (projectData) => {
        const { data } = await createProject(projectData);
        return data;
    };

    const selectProject = (project) => {
        setActiveProject(project);
    };

    const clearActiveProject = () => {
        setActiveProject(null);
    };

    return (
        <ProjectContext.Provider value={{
            activeProject,
            projects,
            selectProject,
            addProject,
            clearActiveProject,
            getProjectById,
            archiveProject,
            loading
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
