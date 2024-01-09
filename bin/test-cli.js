#!/ usr/bin/env node
console.log("hello Leador")

const program = require('commander')

const chalk = require('chalk')

program
    .version('1.0.0')
    .command('create <app-name>')
    .alias("init")
    .description((chalk.cyan('create a new project')))
    .action((name, options) => {
        console.log("project name:", name)
        require("../lib/create")(name, options)
    })

program.parse(process.argv)