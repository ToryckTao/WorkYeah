import dataService from '../utils/dataService.js'

export default {
  data() {
    return {
      isLoading: false,
      loadError: null
    }
  },

  methods: {
    async loadProjects() {
      this.isLoading = true
      try {
        return await dataService.getProjects()
      } catch (error) {
        this.loadError = error.message
        return []
      } finally {
        this.isLoading = false
      }
    },

    async loadTasks() {
      try {
        return await dataService.getTasks()
      } catch (error) {
        return []
      }
    },

    async loadCommunityItems() {
      try {
        return await dataService.getCommunityItems()
      } catch (error) {
        return []
      }
    },

    async loadFavorites() {
      try {
        return await dataService.getFavorites()
      } catch (error) {
        return []
      }
    },

    async loadAgentNodes() {
      try {
        return await dataService.getAgentNodes()
      } catch (error) {
        return []
      }
    },

    getUsers() {
      return dataService.getUsers()
    },

    getUserByName(name) {
      return dataService.getUserByName(name)
    },

    isBackendEnabled() {
      return dataService.isBackendEnabled()
    }
  }
}

