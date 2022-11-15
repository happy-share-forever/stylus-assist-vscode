// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const insertFn = (p: vscode.Position, str: string) => new Promise(resolve => {
	const editor = vscode.window.activeTextEditor!;
	editor.edit((editBuilder) => {
		editBuilder.insert(p, str);
		setTimeout(() => resolve(true));
	});
});
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "stylus-assist" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('stylus-assist.insertClass', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from stylus-assist!');
		const editor = vscode.window.activeTextEditor!;
		const range = editor.document.getWordRangeAtPosition(editor.selection.active);
		const word = editor.document.getText(range);
		if (!word) { return; };

		const content = editor.document.getText();
		const result = /<style[\s\S]*>([\s\S]*?)<\/style>/.exec(content);
		
		if(!result) {
			await insertFn(editor.document.positionAt(content.length), '<style lang="stylus">\n</style>\n');
			await editor.document.save();
		}

		const currentContent = editor.document.getText();
		
		let preInsertText = `\n.${word}\n  \n`;
		const index = currentContent.indexOf('</style>');
		await insertFn(editor.document.positionAt(index), preInsertText);
		await vscode.commands.executeCommand('cursorMove');

		// editor.edit((editBuilder) => {
		// 	editBuilder.insert(new vscode.Position(content.length, 0), insertText);
		// 	// TODO: focus on the new line
		// });
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
