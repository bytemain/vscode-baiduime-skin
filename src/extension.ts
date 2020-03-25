import * as path from "path";
import * as vscode from "vscode";

const cats = {
  "Coding Cat": "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
  "Compiling Cat": "https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif",
  "Testing Cat": "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif"
};

export function activate(context: vscode.ExtensionContext) {
  let folders = vscode.workspace.workspaceFolders;
  console.log(`activate -> folders`, folders);
  vscode.window.showInformationMessage("vscode-baiduime-skin activated");

  vscode.languages.registerHoverProvider("ini", {
    provideHover(document, position, token) {
      return {
        contents: ["Hover Contentini"]
      };
    }
  });

  vscode.languages.registerHoverProvider(
    {
      scheme: "file",
      pattern: new vscode.RelativePattern(folders[0], "Info.txt")
    },
    {
      provideHover(document, position, token) {
        return {
          contents: ["Hover Info.txt"]
        };
      }
    }
  );

  vscode.languages.registerDefinitionProvider(["ini"], {
    provideDefinition(
      document: vscode.TextDocument,
      position: vscode.Position,
      token: vscode.CancellationToken
    ) {
      const fileName = document.fileName;
      const workDir = path.dirname(fileName);
      const word = document.getText(document.getWordRangeAtPosition(position));
      const line = document.lineAt(position);

      console.log("====== 进入 provideDefinition 方法 ======");
      console.log("fileName: " + fileName); // 当前文件完整路径
      console.log("workDir: " + workDir); // 当前文件所在目录
      console.log("word: " + word); // 当前光标所在单词
      console.log("line: " + line.text); // 当前光标所在行
      // 只处理package.json文件
      if (/\/Info\.txt$/.test(fileName)) {
        console.log(word, line.text);
        const json = document.getText();
        console.log(`provideDefinition -> json`, json);
        return new vscode.Location(
          vscode.Uri.file(fileName),
          new vscode.Position(0, 0)
        );
      }
    }
  });

  // Track currently webview panel
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  context.subscriptions.push(
    vscode.commands.registerCommand("catCoding.start", () => {
      const panel = vscode.window.createWebviewPanel(
        "catCoding",
        "Cat Coding",
        vscode.ViewColumn.One,
        {}
      );
      panel.webview.html = getWebviewContent("Coding Cat");

      // Update contents based on view state changes
      panel.onDidChangeViewState(
        e => {
          const panel = e.webviewPanel;
          switch (panel.viewColumn) {
            case vscode.ViewColumn.One:
              updateWebviewForCat(panel, "Coding Cat");
              return;

            case vscode.ViewColumn.Two:
              updateWebviewForCat(panel, "Compiling Cat");
              return;

            case vscode.ViewColumn.Three:
              updateWebviewForCat(panel, "Testing Cat");
              return;
          }
        },
        null,
        context.subscriptions
      );
      function updateWebviewForCat(
        panel: vscode.WebviewPanel,
        catName: keyof typeof cats
      ) {
        panel.title = catName;
        panel.webview.html = getWebviewContent(catName);
      }
    })
  );
}

function getWebviewContent(cat: keyof typeof cats) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="${cats[cat]}" width="300" />
</body>
</html>`;
}
export function deactivate(): Thenable<void> {
  return;
}
