// hooks/useProjects.js  
import { useState, useEffect, useRef, useCallback } from 'react'
import { client } from '../lib/sanity'
import localProjects from '../components/works/projects.json'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usedFallback, setUsedFallback] = useState(false)
  
  // Use ref to track subscription and mounted state
  const subscriptionRef = useRef(null)
  const isMountedRef = useRef(true)

  const fetchProjects = useCallback(async () => {
    // Clean up any existing subscription before making new request
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
      subscriptionRef.current = null
    }

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
      
      if (!isMountedRef.current) return
      
      // Process the data to match your existing component structure
      const processedProjects = data.map(project => ({
        ...project,
        id: project._id, // Map _id to id for compatibility
        link: project.liveLink, // Map liveLink to link
        repo: project.repoLink, // Map repoLink to repo
        lastUpdated: project._updatedAt, // Use _updatedAt as lastUpdated
      }))
      
      setProjects(processedProjects)

      // Set up real-time subscriptions only after successful API fetch
      subscriptionRef.current = client
        .listen('*[_type == "project"]')
        .subscribe((update) => {
          console.log('Project updated:', update)
          fetchProjects()
        })
    } catch (err) {
      if (!isMountedRef.current) return
      console.warn('Sanity API failed, falling back to local projects:', err.message)
      setUsedFallback(true)
      // Fallback to local JSON data when API fails
      setProjects(localProjects)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    isMountedRef.current = true
    fetchProjects()

    // Cleanup function - runs when component unmounts
    return () => {
      isMountedRef.current = false
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }
    }
  }, [fetchProjects])

  return { projects, loading, error, usedFallback, refetch: fetchProjects }
}
