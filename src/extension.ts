// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { Copilot } from './copilot';
//var co = new Copilot()
//await co.gistRequest("", ""),

//let limit = 0;

async function provideInlineCompletions(document: vscode.TextDocument, position: vscode.Position, context: vscode.InlineCompletionContext, token: vscode.CancellationToken): Promise<vscode.InlineCompletionItem[]> {
	var co = new Copilot()

	const textCursor = document.getText(new vscode.Range(position.with(undefined, 0), position));
	const question = textCursor.split("copilot")[1].split(" in ")[0].trim();
	const language = textCursor.split("copilot")[1].split(" in ")[1].trim();

	if(textCursor.startsWith("copilot")) {
		//console.log(question);
		//console.log(language);
		let result = await co.gistRequest(question, language);
		let res : vscode.InlineCompletionItem = { text: "\n" + result, };
		return [res];
	}

	return [];
}

const provider : vscode.InlineCompletionItemProvider<vscode.InlineCompletionItem> = {
    provideInlineCompletionItems: provideInlineCompletions
};


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	//console.log("All Up And Runing.");
	let disposable = vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider);
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
