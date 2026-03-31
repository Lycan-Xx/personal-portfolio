// hooks/useProjects.js  
import { useState, useEffect } from 'react'
import { client } from '../lib/sanity'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        setError(err)
        console.error('Error fetching projects:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()

    // Optional: Set up real-time subscriptions
    const subscription = client
      .listen('*[_type == "project"]')
      .subscribe((update) => {
        console.log('Project updated:', update)
        // Re-fetch data when projects change
        fetchProjects()
      })

    return () => subscription.unsubscribe()
  }, [])

  return { projects, loading, error, refetch: () => fetchProjects() }
}
