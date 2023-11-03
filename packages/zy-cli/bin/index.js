#!/usr/bin/env node

const yargs = require('yargs');
const { inquirerPrompt } = require('./inquirer');
const { copyDir, checkMkdirExists } = require('./copy');
const path = require('path');
const { install } = require('./manage');

// 命令配置
yargs.command({
  // 字符串，子命令名称，也可以传递数组，如 ['create', 'c']，表示子命令叫 create，其别名是 c
  command: 'create <name>',
  // 字符串，子命令描述信息；
  describe: 'create a new project',
  // 对象，子命令的配置项；builder也可以是一个函数
  builder: {
    name: {
      alias: 'n', // 别名
      demandOption: true, // 是否必填
      describe: 'name of a project', // 描述
      default: 'app' // 默认
    }
  },
  // 函数形式的
  // builder: (yargs) => {
  //   return yargs.option('name', {
  //     alias: 'n',
  //     demand: true,
  //     describe: 'name of a project',
  //     type: 'string'
  //   })
  // },
  handler: (argv) => {
    inquirerPrompt(argv).then((answers) => {
      // 此处已经获取到了完整的模版参数;开始进行文件处理
      const { name, type, frame, library } = answers;

      // 判断是否存在该项目文件夹
      const isMkdirExists = checkMkdirExists(
        path.resolve(process.cwd(),`./${name}`)
      );

      if (isMkdirExists) {
        console.log( `${name}文件夹已经存在`);
      } else {
        const templatePath = path.resolve(__dirname, `../src/${type}`);
        const targetPath = path.resolve(process.cwd(), `./${name}`);
        copyDir(templatePath, targetPath);

        // 拷贝模版文件
        // const templatePath = path.resolve(__dirname, `../src/${type}/packages.tpl`);
        // const targetPath = path.resolve(process.cwd(), `./${name}/packages.json`);
        // copyTemplate(templatePath, targetPath, {name: name})

        install(process.cwd(), answers)
      }
    });
  }
}).argv;