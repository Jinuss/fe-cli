const path = require("path")
const fs = require("fs-extra")
const inquirer = require("inquirer")
const Generator = require('./Generator')

module.exports = async (name, options) => {
    const cwd = process.cwd();

    const targetDir = path.join(cwd, name)

    if (fs.existsSync(targetDir)) {
        if (options.force) {
            await fs.remove(targetDir)
        } else {
            let { action } = await inquirer.prompt([
                {
                    name: "action",
                    type: "list",
                    message: "target directory already exists,please pick an action below:",
                    choices: [
                        {
                            name: "Overwrite(覆盖)",
                            value: 1
                        },
                        {
                            name: "Cancel(取消)",
                            value: 2
                        },
                    ]
                }
            ])
            if (action == 2) {
                return
            } else if (action == 1) {
                console.log('\r\nRemoving...')
                await fs.remove(targetDir)
            }
        }
    }

    const generator = new Generator(name, targetDir);

    generator.create()
}