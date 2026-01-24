import React, { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
    const [activeProject, setActiveProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load projects and active selection from local storage
        const storedProjects = localStorage.getItem('userProjects');
        const storedActive = localStorage.getItem('activeProject');

        if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
        }

        if (storedActive) {
            setActiveProject(JSON.parse(storedActive));
        }

        setLoading(false);
    }, []);

    const addProject = (projectData) => {
        const newProject = {
            ...projectData,
            id: crypto.randomUUID(), // Mock ID
            createdAt: new Date().toISOString()
        };

        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        localStorage.setItem('userProjects', JSON.stringify(updatedProjects));

        return newProject;
    };

    const selectProject = (project) => {
        setActiveProject(project);
        localStorage.setItem('activeProject', JSON.stringify(project));
    };

    const clearActiveProject = () => {
        setActiveProject(null);
        localStorage.removeItem('activeProject');
    };

    return (
        <ProjectContext.Provider value={{
            activeProject,
            projects,
            selectProject,
            addProject,
            clearActiveProject,
            loading
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
