import {join, dirname, basename} from 'path'

export function subPaths (dir) {
  const paths = []
  let oldPath
  while (true) {
    const base = basename(dir)
    const newPath = oldPath ? join(base, oldPath) : base
    oldPath = newPath
    paths.push(newPath)
    dir = dirname(dir)
    if (dir === '/' || dir === '.') {
      break
    }
  }

  return paths
}