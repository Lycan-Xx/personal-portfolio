// lib/sanity.js
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'yeizgznh', // Get this from sanity.io/manage after setup
  dataset: 'production',
  useCdn: true, // Enable for faster, cheaper responses using Sanity's CDN
  apiVersion: '2024-01-01', // Use current date (YYYY-MM-DD)
})

// Helper for generating image URLs with transformations
const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}