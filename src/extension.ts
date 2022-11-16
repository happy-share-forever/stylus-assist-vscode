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
const before2CharCheckList: string[] = ['="', ', ', '"['];
const before2CharCheckInClassArr: string[] = [', ', '"['];
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "stylus-assist" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const insertClassAction = async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from stylus-assist!');
		console.log('insertClassAction run!');
		if (!vscode.window.activeTextEditor) {
			return;
		}
		const editor = vscode.window.activeTextEditor!;
		const activePosition = editor.selection.active;
		const before2Char = editor.document.getText(new vscode.Range(new vscode.Position(activePosition.line, activePosition.character - 2), activePosition));
		const after1Char = editor.document.getText(new vscode.Range(activePosition, new vscode.Position(activePosition.line, activePosition.character + 1)));
		console.log('before2Char', before2Char);
		// 自动插入 $style.
		if (before2CharCheckList.includes(before2Char)) {
			let insertContent = '$style.';
			// 数组情况特殊处理
			if (before2CharCheckInClassArr.includes(before2Char) && after1Char !== ']') {
				insertContent += ', ';
			}
			await insertFn(activePosition, insertContent);
			await editor.document.save();
			const caretPosition = new vscode.Position(activePosition.line, activePosition.character + 7);
			editor.selections = [new vscode.Selection(caretPosition, caretPosition)];
			return;
		}
		const range = editor.document.getWordRangeAtPosition(editor.selection.active);
		const word = editor.document.getText(range);
		if (!word || word.length > 50) { return; };

		const content = editor.document.getText();
		const result = /<style[\s\S]*>([\s\S]*?)<\/style>/.exec(content);

		if (!result) {
			await insertFn(editor.document.positionAt(content.length), '<style lang="stylus">\n</style>\n');
			await editor.document.save();
		}

		const currentContent = editor.document.getText();

		let preInsertText = `\n.${word}\n  \n`;
		const index = currentContent.indexOf('</style>');
		const newPosition = editor.document.positionAt(index);
		await insertFn(newPosition, preInsertText);
		const caretPosition = new vscode.Position(newPosition.line + 2, 2);
		editor.selections = [new vscode.Selection(caretPosition, caretPosition)];
		editor.revealRange(new vscode.Range(caretPosition, caretPosition), vscode.TextEditorRevealType.InCenter);
	};
	vscode.commands.registerCommand('stylus-assist.insertClass', insertClassAction);
}

// This method is called when your extension is deactivated
export function deactivate() { }
