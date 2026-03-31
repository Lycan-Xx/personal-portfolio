// hooks/useProjects.js  
import { useState, useEffect } from 'react'
import { client } from '../lib/sanity'
import localProjects from '../components/works/projects.json'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usedFallback, setUsedFallback] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        
        // GROQ query to fetch projects (similar to GraphQL)
        const query = `
          *[_type == "project"] | order(displayOrder asc, _createdAt desc) {
            _id,
            _createdAt,
            _updatedAt,
            title,
            slug,
            description,
            images[] {
              asset,
              alt
            },
            tags,
            status,
            liveLink,
            repoLink,
            featured,
            displayOrder,
            completedDate
          }
        `
        
        const data = await client.fetch(query)
        
        // Process the data to match your existing component structure
        const processedProjects = data.map(project => ({
          ...project,
          id: project._id, // Map _id to id for compatibility
          link: project.liveLink, // Map liveLink to link
          repo: project.repoLink, // Map repoLink to repo
          lastUpdated: project._updatedAt, // Use _updatedAt as lastUpdated
        }))
        
        setProjects(processedProjects)
      } catch (err) {
        console.warn('Sanity API failed, falling back to local projects:', err.message)
        setUsedFallback(true)
        // Fallback to local JSON data when API fails
        setProjects(localProjects)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()

    // Optional: Set up real-time subscriptions (only if API works)
    try {
      const subscription = client
        .listen('*[_type == "project"]')
        .subscribe((update) => {
          console.log('Project updated:', update)
          fetchProjects()
        })

      return () => subscription.unsubscribe()
    } catch (e) {
      // Skip subscription if API not available
    }
  }, [])

  return { projects, loading, error, usedFallback, refetch: () => fetchProjects() }
}
