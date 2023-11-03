const path = require('path');
const { exec } = require('child_process');
const ora = require("ora");

// 组件库映射,前面是用户输入/选择,后面是目标安装的组件库
const LibraryMap = {
  'Ant Design': 'antd',
  'iView': 'view-ui-plus',
  'Ant Design Vue': 'ant-design-vue',
  'Element': 'element-plus',
}

function install(cmdPath, options) {
  // 用户选择的框架 和 组件库
  const { frame, library } = options;
  // 串行安装命令
  const command = `pnpm add ${frame} && pnpm add ${LibraryMap[library]}`
  return new Promise(function (resolve, reject) {
    const spinner = ora();
    spinner.start(
      `正在安装依赖，请稍等`
    );
    // 执行安装命令
    exec(
      command,
      {
        // 命令执行的目录
        cwd: path.resolve(cmdPath),
      },
      function (error) {
        if (error) {
          reject();
          spinner.fail(`依赖安装失败`);
          return;
        }
        spinner.succeed(`依赖安装成功`);
        resolve()
      }
    )
  })
}
exports.install = install;