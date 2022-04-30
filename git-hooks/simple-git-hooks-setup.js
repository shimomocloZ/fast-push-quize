var path = require('path')
const { execFile } = require('child_process')

// windowsかどうか
const isWin = process.platform === 'win32'

if (isWin) {
  var exePath = path.resolve(__dirname, './simple-git-hooks-setup.bat')
  execFile(exePath, [], (error, stdout, stderr) => {
    if (error instanceof Error) {
      console.error(error)
      console.log('execFile with windows os Error')
      process.exit(1)
    } else {
      console.log('execFile with windows os Success!')
      process.exit(0)
    }
  })
} else {
  var exePath = path.resolve(__dirname, './simple-git-hooks-setup.sh')
  execFile('sh', [exePath], (error, stdout, stderr) => {
    if (error instanceof Error) {
      console.error(error)
      console.log('execFile with mac os Error')
      process.exit(1)
    } else {
      console.log('execFile with mac os Success!')
      process.exit(0)
    }
  })
}
