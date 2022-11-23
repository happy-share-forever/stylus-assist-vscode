import * as vscode from 'vscode'
export const insertFn = (p: vscode.Position, str: string): Promise<any> => new Promise((resolve, reject) => {
  const editor = vscode.window.activeTextEditor
  if (editor) {
    try {
      void editor.edit((editBuilder: vscode.TextEditorEdit): void => {
        editBuilder.insert(p, str)
        setTimeout((): void => {
          resolve(true)
        })
      })
    } catch (e) {
      reject(e)
    }
  } else {
    resolve(true)
  }
})
