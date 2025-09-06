export default {
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Project Title',
        type: 'string',
        validation: Rule => Rule.required().max(100)
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96,
        },
      },
      {
        name: 'description',
        title: 'Project Description',
        type: 'text',
        rows: 4,
        validation: Rule => Rule.required().min(10).max(500)
      },
      {
        name: 'images',
        title: 'Project Images',
        type: 'array',
        of: [
          {
            type: 'image',
            options: {
              hotspot: true, // Enables image cropping
            },
            fields: [
              {
                name: 'alt',
                type: 'string',
                title: 'Alternative Text',
                description: 'Important for accessibility'
              }
            ]
          }
        ],
        validation: Rule => Rule.min(1).error('At least one image is required'),
        options: {
          layout: 'grid'
        }
      },
      {
        name: 'tags',
        title: 'Technologies Used',
        type: 'array',
        of: [{type: 'string'}],
        options: {
          layout: 'tags'
        },
        validation: Rule => Rule.min(1).error('At least one technology tag is required')
      },
      {
        name: 'status',
        title: 'Project Status',
        type: 'string',
        options: {
          list: [
            {title: 'Active - Currently maintained', value: 'active'},
            {title: 'Dormant - No recent updates', value: 'dormant'},
            {title: 'Experimental - Testing/Learning', value: 'experimental'},
            {title: 'Archived - No longer maintained', value: 'archived'}
          ],
          layout: 'radio' // Better UX than dropdown
        },
        initialValue: 'active',
        validation: Rule => Rule.required()
      },
      {
        name: 'liveLink',
        title: 'Live Demo URL',
        type: 'url',
        description: 'Link to the live/deployed version'
      },
      {
        name: 'repoLink',
        title: 'Repository URL', 
        type: 'url',
        description: 'Link to GitHub/GitLab repository'
      },
      {
        name: 'featured',
        title: 'Featured Project',
        type: 'boolean',
        description: 'Show this project prominently',
        initialValue: false
      },
      {
        name: 'displayOrder',
        title: 'Display Order',
        type: 'number',
        description: 'Lower numbers appear first',
        initialValue: 0,
        validation: Rule => Rule.min(0)
      },
      {
        name: 'completedDate',
        title: 'Project Completion Date',
        type: 'date',
        description: 'When was this project completed?'
      }
    ],
    
    // Define how documents are sorted in the studio
    orderings: [
      {
        title: 'Display Order (Low to High)',
        name: 'displayOrderAsc',
        by: [
          {field: 'displayOrder', direction: 'asc'},
          {field: '_createdAt', direction: 'desc'}
        ]
      },
      {
        title: 'Recently Updated',
        name: 'updatedDesc',
        by: [
          {field: '_updatedAt', direction: 'desc'}
        ]
      },
      {
        title: 'Recently Created', 
        name: 'createdDesc',
        by: [
          {field: '_createdAt', direction: 'desc'}
        ]
      }
    ],
    
    // Customize how projects appear in lists
    preview: {
      select: {
        title: 'title',
        status: 'status', 
        featured: 'featured',
        media: 'images.0' // First image as thumbnail
      },
      prepare(selection) {
        const {title, status, featured, media} = selection
        const subtitle = `${status}${featured ? ' • Featured' : ''}`
        
        return {
          title: title,
          subtitle: subtitle,
          media: media
        }
      }
    }
  }