const copydir = require('copy-dir')
const fs = require('fs');
const path = require('path')
const Mustache = require('mustache');

function copyDir (from, to, option) {
  // 目录守卫,不存在的目录结构会去创建
  mkdirGuard(to);
  copydir.sync(from, to, option);
}

function copyFile(from, to) {
  const buffer = fs.readFileSync(from);
  const parentPath = path.dirname(to);
  mkdirGuard(parentPath)
  fs.writeFileSync(to, buffer);
}

// 读取模版内容
function renderTemplate(path, data = {}) {
  const str = fs.readFileSync(path, { encoding: 'utf8' })
  return Mustache.render(str, data);
}

// 拷贝模版
function copyTemplate(from, to, data = {}) {
  if (path.extname(from) !== '.tpl') {
    return copyFile(from, to);
  }
  const parentToPath = path.dirname(to);
  mkdirGuard(parentToPath);
  fs.writeFileSync(to, renderTemplate(from, data));
}


/**
 * Checks if a directory or file exists at the given path.
 * @param {string} path - The path to check for existence.
 * @returns {boolean} - Returns true if the directory or file exists, false otherwise.
*/
function checkMkdirExists(path){
  return fs.existsSync(path);
}

// 目录守卫
function mkdirGuard(target) {
  try {
    fs.mkdirSync(target, { recursive: true });
  } catch (e) {
    mkdirp(target)
    function mkdirp(dir) {
      if (fs.existsSync(dir)) { return true }
      const dirname = path.dirname(dir);
      mkdirp(dirname);
      fs.mkdirSync(dir);
    }
  }
}

exports.copyDir = copyDir;
exports.copyFile = copyFile;
exports.checkMkdirExists = checkMkdirExists;
exports.mkdirGuard = mkdirGuard;
exports.renderTemplate = renderTemplate;
exports.copyTemplate = copyTemplate;
