// hooks/useProjects.js  
import { useState, useEffect, useCallback } from 'react'
import localProjects from '../components/works/projects.json'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProjects = useCallback(() => {
    try {
      setLoading(true)
      // Load projects from local JSON file and sort by displayOrder
      const sortedProjects = [...localProjects].sort((a, b) => 
        a.displayOrder - b.displayOrder
      )
      setProjects(sortedProjects)
      setError(null)
    } catch (err) {
      console.error('Failed to load projects:', err.message)
      setError(err.message)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return { projects, loading, error, refetch: fetchProjects }
}
