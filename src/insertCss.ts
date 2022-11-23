import * as vscode from 'vscode'
import { insertFn } from './utils'

const formatCode: Function = (codeText: string, space: string): string => {
  // 去除分号
  const text = codeText.replace(/;/g, '')
  // 按行分割
  const stringEnters = text.split('\n')

  const resultList = []
  for (let i = 0; i < stringEnters.length; i++) {
    // 去除两端空格
    let middleString = stringEnters[i].trim()
    // 处理有冒号
    if (middleString.includes(':')) {
      const split = middleString.split(':')
      for (let j = 0; j < split.length; j++) {
        split[j] = split[j].trim()
      }
      middleString = split.join(' ')
    }
    // 最后一行不换行
    const enterSymbol = (i === stringEnters.length - 1 ? '' : '\n')
    if (i > 0) {
      resultList.push(space + middleString + enterSymbol)
      continue
    }
    resultList.push(middleString + enterSymbol)
  }
  // 全部拼接
  return resultList.join('')
}

export const insertCss = async (): Promise<any> => {
  console.log('insertCss')
  const activePosition = vscode.window.activeTextEditor?.selection.active
  if (!activePosition) return
  const space = ' '.repeat(activePosition.character)
  const text = await vscode.env.clipboard.readText()
  if (text) {
    const result = formatCode(text, space)
    console.log(result)
    await insertFn(activePosition, result)
  }
}
