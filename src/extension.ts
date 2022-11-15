// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "stylus-assist" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('stylus-assist.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from stylus-assist!');

		const editor = vscode.window.activeTextEditor!;
		const range = editor.document.getWordRangeAtPosition(editor.selection.active);
		const word = editor.document.getText(range);
		if (!word) { return; };

		const content = editor.document.getText();

		editor.edit((editBuilder) => {
			editBuilder.insert(new vscode.Position(content.length, 0), word);
			// TODO: focus on the new line
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
