// studio/sanity.cli.js  
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'yeizgznh', // Same as above
    dataset: 'production'
  }
})