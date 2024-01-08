#!/ usr/bin/env node
console.log("hello world")

const program = require('commander')

const chalk = require('chalk')

program
    .command('create <app-name>')
    .description((chalk.cyan('create a new project')))
    .action((name, options) => {
        console.log("project name:", name)
        require("../lib/create")(name, options)
    })

program.parse(process.argv)