const { getRepoList, getTagList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const downloadGitRepo = require('download-git-repo')
const chalk = require('chalk')
const path = require('path')
const { USER } = require('./const')
const fs = require('fs-extra')

async function wrapLoading(fn, message, ...args) {
    const spinner = ora(message)
    spinner.start()

    try {
        const result = await fn(...args)
        spinner.succeed()
        return result
    } catch (error) {
        spinner.fail("Request faild,please concat sunqi,thanks!")
    }
}

class Generator {
    constructor(name, tarrgetDir) {
        this.name = name;
        this.tarrgetDir = tarrgetDir
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }

    async getRepo() {
        const repoList = await wrapLoading(getRepoList, 'waiting fetch template')

        if (!repoList) {
            return
        }

        const repos = repoList.map(item => item.name)

        const { repo } = await inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: 'After you understand what you want do, please choose a suitable template to create project:'
        })

        return repo
    }

    async getTag(repo) {
        const tags = await wrapLoading(getTagList, "waiting fetch tag", repo)

        if (!tags) {
            return
        }

        const tagList = tags.map(item => item.name)

        return tagList[0]
    }

    async download(repo, tag) {
        const url = `${USER}/${repo}${tag ? "#" + tag : ''}`;

        await wrapLoading(this.downloadGitRepo, 'waiting download template', url, path.resolve(process.cwd(), this.tarrgetDir))
    }

    async create() {
        const repo = await this.getRepo()

        const tag = await this.getTag(repo)

        await this.download(repo, tag)

        console.log(`\r\n successfully created, follow below steps:`)
        console.log(`\r\n  1. cd ${chalk.cyan(this.name)}`)
        console.log(`2.Read carefully ${chalk.cyan("README.md")}`)
    }
}

module.exports = Generator
