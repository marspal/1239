# vite.md

> parseSFC
```js 
const fs = require('fs')
const { parse } = require('@vue/compiler-sfc')
const cache = new Map()
// exports.parseSFC = filename => {
exports.parseSFC = (filename, saveCache = false) => { 
  const content = fs.readFileSync(filename, 'utf-8')
  // 读取文件desciptor， erros
  const { descriptor, errors } = parse(content, {
    filename
  })
  if (errors) {
    // TODO
  }
  // 获取当前文件的上次编译的结果
  const prev = cache.get(filename)
  // 更新结果
  if(saveCache){
    cache.set(filename, descriptor)
  }
  return [descriptor, prev]; //返回当前值 和上一次值
}
```


> utils
```js
function send(res, source, mime) {
  res.setHeader('Content-Type', mime)
  res.end(source)
}
function sendJS(res, source) {
  send(res, source, 'application/javascript')
}
exports.send = send
exports.sendJS = sendJS
```

> vue middleware
```js
const fs = require('fs')
const url = require('url')
const path = require('path')
const qs = require('querystring')
const { parseSFC } = require('./parseSFC')
const { compileTemplate } = require('@vue/compiler-sfc')
const { sendJS } = require('./utils')

module.exports = (req, res) => {
  // pathname, query: Object  serch
  const parsed = url.parse(req.url, true)
  const query = parsed.query; // 参数对象 {query: "string"}
  const filename = path.join(process.cwd(), parsed.pathname.slice(1))
  /* save last accessed descriptor on the client */
  const [descriptor] = parseSFC(filename, true)
  if (!query.type) {
    // let code = ``
    // inject hmr client
    let code = `import "/__hmrClient"\n`
    // TODO use more robust rewrite
    if (descriptor.script) {
      // 替换 export default 替换成const script
      /* export default {
        data: () => ({ count: 0 })
      }
      const script = {
        data: () => ({count});
      }
      export default script;
      */
      code += descriptor.script.content.replace(
        `export default`,
        'const script ='
      )
      // 导出
      code += `\nexport default script`
    }

    // 解析 template
    if (descriptor.template) {
      code += `\nimport { render } from ${JSON.stringify(
        parsed.pathname + `?type=template${query.t ? `&t=${query.t}` : ``}`
      )}`
      code += `\nscript.render = render`
    }
    if (descriptor.style) {
      // TODO
    }
    code += `\nscript.__hmrId = ${JSON.stringify(parsed.pathname)}`
    return sendJS(res, code)
  }

  if (query.type === 'template') {
    const { code, errors } = compileTemplate({
      source: descriptor.template.content,
      filename,
      compilerOptions: {
        runtimeModuleName: '/vue.js'
      }
    })

    if (errors) {
      // TODO
    }
    return sendJS(res, code)
  }

  if (query.type === 'style') {
    // TODO
    return
  }

  // TODO custom blocks
}

```

> fileWatcher > hmrWatcher

```js
const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const { parseSFC } = require('./parseSFC')


// script内容变化, 告诉客户端reload把变化的path通知前端
// 如果是template变化, rerender
exports.createFileWatcher = (notify) => {
  // 创建fileWatcher
  const fileWatcher = chokidar.watch(process.cwd(), {
    ignored: [/node_modules/]
  })

  fileWatcher.on('change', (file) => {
    const = resourcePath = '/' + path.relative(process.cwd(), file);
    if (file.endsWith('.vue')) {
      // check which part of the file changed
      const [descriptor, prevDescriptor] = parseSFC(file)
      // const resourcePath = '/' + path.relative(process.cwd(), file)

      if (!prevDescriptor) {
        // the file has never been accessed yet
        return
      }

      if (
        (descriptor.script && descriptor.script.content) !==
        (prevDescriptor.script && prevDescriptor.script.content)
      ) {
        console.log(`[hmr] <script> for ${resourcePath} changed. Triggering component reload.`)
        notify({
          type: 'reload',
          path: resourcePath
        })
        return
      }

      if (
        (descriptor.template && descriptor.template.content) !==
        (prevDescriptor.template && prevDescriptor.template.content)
      ) {
        console.log(`[hmr] <template> for ${resourcePath} changed. Triggering component re-render.`)
        notify({
          type: 'rerender',
          path: resourcePath
        })
        return
      }

      // TODO styles
    } else {
      console.log(`[hmr] script file ${resourcePath} changed. Triggering full page reload.`)
      notify({
        type: 'full-reload'
      })
    }
  })
}

```

> hmrProxy:  改名为hmrClient

```js
// This file runs in the browser.

const socket = new WebSocket(`ws://${location.host}`)

// Listen for messages
socket.addEventListener('message', ({ data }) => {
  const { type, path, index } = JSON.parse(data)
  switch (type) {
    case 'connected':
      console.log(`[vds] connected.`)
      break
    case 'reload':
      import(`${path}?t=${Date.now()}`).then(m => {
        __VUE_HMR_RUNTIME__.reload(path, m.default)
        console.log(`[vds][hmr] ${path} reloaded.`)
      })
      break
    case 'rerender':
      import(`${path}?type=template&t=${Date.now()}`).then(m => {
        __VUE_HMR_RUNTIME__.rerender(path, m.render)
        console.log(`[vds][hmr] ${path} template updated.`)
      })
      break
    case 'update-style':
      import(`${path}?type=style&index=${index}&t=${Date.now()}`).then(m => {
        // TODO style hmr
      })
      break
    case 'full-reload':
      location.reload()
  }
})

// ping server
socket.addEventListener('close', () => {
  console.log(`[vds] server connection lost. polling for restart...`)
  setInterval(() => {
    new WebSocket(`ws://${location.host}`).addEventListener('open', () => {
      location.reload()
    })
  }, 1000)
})
```
```js
// location 返回页面的host
const socket = new WebSocket(`ws://${location.host}`)
```
## 第三方库

> resolve-cwd: 从当前工作目录解析一个类似于require.resolve()的模块的路径