const { getRepoList, getTagList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const downloadGitRepo = require('download-git-repo')
const chalk = require('chalk')
const path = require('path')
const { USER } = require('./const')
const fs = require('fs-extra')
const pkg = require('../package.json')

async function wrapLoading(fn, message, ...args) {
    const spinner = ora(message)
    spinner.start()

    try {
        const result = await fn(...args)
        spinner.succeed()
        return { result, code: 0 }
    } catch (error) {
        spinner.fail(`download template failed,please click ${chalk.cyan("https://github.com/dtd-wuhan")} to download!`)
        return { code: -1 }
    }
}

class Generator {
    constructor(name, tarrgetDir) {
        this.name = name;
        this.tarrgetDir = tarrgetDir
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }

    async getRepo() {
        const { result: repoList } = await wrapLoading(getRepoList, 'waiting fetch template')

        if (!repoList) {
            return
        }

        const repos = repoList?.map(item => item.name)

        const { repo } = await inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: 'Please choose a suitable template:'
        })

        return repo
    }

    async getTag(repo) {
        const { result: tags } = await wrapLoading(getTagList, "waiting fetch tag", repo)

        if (!tags) {
            return
        }

        const tagList = tags.map(item => item.name)

        return tagList[0]
    }

    async download(repo, tag) {
        const url = `${USER}/${repo}${tag ? "#" + tag : ''}`;

        return await wrapLoading(this.downloadGitRepo, 'waiting download template', url, path.resolve(process.cwd(), this.tarrgetDir))
    }

    async create() {
        const repo = await this.getRepo()

        const tag = await this.getTag(repo)
        const resp = await this.download(repo, tag)
        if (resp.code == 0) {
            console.log(`\r\n ${chalk.green('success')} created, follow below steps:`)
            console.log(`\r\n 1.cd ${chalk.cyan(this.name)}`)
            console.log(`\r\n 2.Read carefully ${chalk.cyan("README.md")}`)
        }
    }
}

module.exports = Generator
