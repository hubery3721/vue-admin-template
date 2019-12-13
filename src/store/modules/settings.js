import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo, breadcrumb } = defaultSettings

const state = {
    showSettings: showSettings,
    tagsView: tagsView,
    fixedHeader: fixedHeader,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo,
    breadcrumb: breadcrumb
}

const mutations = {
    CHANGE_SETTING: (state, { key, value }) => {
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    }
}

const actions = {
    changeSetting({ commit }, data) {
        commit('CHANGE_SETTING', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

