import * as vscode from 'vscode'
const insertFn = (p: vscode.Position, str: string): Promise<any> => new Promise((resolve, reject) => {
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
const before2CharCheckList: string[] = ['="', ', ', '"[']
const before2CharCheckInClassArr: string[] = [', ', '"[']
export const insertClassAction = async (): Promise<any> => {
  // The code you place here will be executed every time your command is executed
  // Display a message box to the user
  // vscode.window.showInformationMessage('Hello World from stylus-assist!');

  if (vscode.window.activeTextEditor == null) {
    return
  }
  const editor = vscode.window.activeTextEditor
  const activePosition = editor.selection.active
  const before2Char = editor.document.getText(new vscode.Range(new vscode.Position(activePosition.line, activePosition.character - 2), activePosition))
  const after1Char = editor.document.getText(new vscode.Range(activePosition, new vscode.Position(activePosition.line, activePosition.character + 1)))
  // 自动插入 $style.
  if (before2CharCheckList.includes(before2Char)) {
    let insertContent = '$style.'
    // 数组情况特殊处理
    if (before2CharCheckInClassArr.includes(before2Char) && after1Char !== ']') {
      insertContent += ', '
    }
    await insertFn(activePosition, insertContent)
    await editor.document.save()
    const caretPosition = new vscode.Position(activePosition.line, activePosition.character + 7)
    editor.selections = [new vscode.Selection(caretPosition, caretPosition)]
    return
  }
  const range = editor.document.getWordRangeAtPosition(editor.selection.active)
  const word = editor.document.getText(range)
  if (!word || word.length > 50) { return };

  const content = editor.document.getText()
  const result = /<style[\s\S]*>([\s\S]*?)<\/style>/.exec(content)

  if (result == null) {
    await insertFn(editor.document.positionAt(content.length), '<style lang="stylus">\n</style>\n')
    await editor.document.save()
  }

  const currentContent = editor.document.getText()

  const preInsertText = `\n.${word}\n  \n`
  const index = currentContent.indexOf('</style>')
  const newPosition = editor.document.positionAt(index)
  await insertFn(newPosition, preInsertText)
  const caretPosition = new vscode.Position(newPosition.line + 2, 2)
  editor.selections = [new vscode.Selection(caretPosition, caretPosition)]
  editor.revealRange(new vscode.Range(caretPosition, caretPosition), vscode.TextEditorRevealType.InCenter)
}
