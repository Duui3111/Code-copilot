"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const copilot_1 = require("./copilot");
//var co = new Copilot()
//await co.gistRequest("", ""),
//let limit = 0;
async function provideInlineCompletions(document, position, context, token) {
    var co = new copilot_1.Copilot();
    const textCursor = document.getText(new vscode.Range(position.with(undefined, 0), position));
    const question = textCursor.split("copilot")[1].split(" in ")[0].trim();
    const language = textCursor.split("copilot")[1].split(" in ")[1].trim();
    if (textCursor.startsWith("copilot")) {
        //console.log(question);
        //console.log(language);
        let result = await co.gistRequest(question, language);
        let res = { text: "\n" + result, };
        return [res];
    }
    return [];
}
const provider = {
    provideInlineCompletionItems: provideInlineCompletions
};
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    //console.log("All Up And Runing.");
    let disposable = vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map