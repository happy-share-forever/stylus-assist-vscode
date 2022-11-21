// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { insertClassAction } from './insertClass'
import { insertCss } from './insertCss'
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate (context: vscode.ExtensionContext): void {
  vscode.commands.registerCommand('stylus-assist.insertClass', insertClassAction)
  vscode.commands.registerCommand('stylus-assist.insertCss', insertCss)
}
export function deactivate (): void { }
