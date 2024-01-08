const axios = require("axios")
const { USER } = require("./const")

axios.interceptors.response.use(res => res.data)

async function getRepoList() {
    return axios.get(`https://api.github.com/orgs/${USER}/repos`)
}

async function getTagList(repo) {
    return axios.get(`https://api.github.com/repos/${USER}/${repo}/tags`)
}

module.exports = {
    getRepoList,
    getTagList
}