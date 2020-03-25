import * as path from "path";
import {
  CancellationToken,
  ExtensionContext,
  languages,
  Position,
  Range,
  TextDocument,
  window,
  Uri
} from "vscode";
import { DocumentLine, textToFileLines } from "../libs/fileUtils";

class TilHoverProvide {
  context: ExtensionContext;
  deco: Map<string, any>;
  constructor(context: ExtensionContext) {
    this.context = context;
    this.deco = new Map();
    this.init();
  }
  getCurrentRangeText = () => {
    let text = window.activeTextEditor.document.getText();
    window.activeTextEditor.setDecorations;
    const fileLines = textToFileLines(text);
    let lines: DocumentLine[] = [];
    window.activeTextEditor.visibleRanges.forEach((range: Range) => {
      for (let i = range.start.line; i <= range.end.line + 1; i++) {
        if (!!fileLines[i]?.text) {
          lines.push(fileLines[i]);
        }
      }
    });
    return lines;
  };
  init = () => {
    console.log("TilProvide is inited.");
    let disposable = this.hover();
    this.decoration();
    this.context.subscriptions.push(disposable);
  };

  decoration = () => {
    let lines = this.getCurrentRangeText();
    console.log(`TilHoverProvide -> decoration -> lines`, lines);
    let decoTest = window.createTextEditorDecorationType({
      border: "dashed 1px",
      backgroundColor: "#000",
      gutterIconPath: Uri.parse(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAADcCAYAAAAbWs+BAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gIUARQAHY8+4wAAApBJREFUeNrt3cFqAjEUhlEjvv8rXzciiiBGk/He5JxdN2U649dY+KmnEwAAAAAv2uMXEeGOwERntwAEB4IDBAeCAwQHggPBAYIDwQGCA8GB4ADBgeAAwYHgAMGB4EBwgOCgpkuKq2it/r8Li2hbvGKqP6s/PycnHHv9YvSWEgQHCA4EBwgOBAeCAwQHggMEByXM+QRUE6D3suwuPafDn5MTDg50KXnVPSdxa54y/oYDwQGCA8EBggPBAYIDwYHggBE+X5rY3Y3Tey97Nn2eU+rnlGfaZa6Ft5SA4EBwgOBAcCA4QHAgOEBwIDjgZu60y1xrDPtIJxwgOBAcIDgQHAgOEBwIDhAcCA4EBwgOBAcIDgQHCA4EB4IDBAeCAwQHggPBAYIDwQGCA8GB4ADBgeAAwYHgAMGB4GADcz9y2McIgxMOBAeCAwQHggMEB4IDwQGCA8EBggPBATdP6+KIGPRdW7i1LCFi6ALfCQfeUoLgAMGB4ADBgeBAcIDgQHCA4CCdOVvK7quwveQgg7eRTjjwlhIQHAgOBAcIDgQHCA4EB4IDBAfl5dhSdl+17SX3F22rdLlOOBAcCA4QHAgOEBwIDgQHCA4EBwgO0qm5pez6Ce0uSym2jXTCgeAAwYHgQHCA4EBwgOBAcCA4QHBQ3vpbyu47Yns51OLbSCccCA4QHAgOBAcIDgQHCA4EB4ID5jDt+vkObjgFM9dywoHgAMGB4EBwgOBAcIDgQHAgOEBwsA5bysPveMLtpW2kEw4EBwgOBAcIDgQHggMEB4IDBAeCg33ZUqZ/Ql9sL20jnXCA4EBwIDhAcCA4QHAgOBAcIDgQHNOZai3DlhKccCA4QHAgOEBwIDgQHCA4AAAAAGA1VyxaWIohrgXFAAAAAElFTkSuQmCC"
      ),
      gutterIconSize: "contain"
    });

    let ranges: Range[] = [];
    lines.forEach(value => {
      if (value.text.startsWith("SOURCE_RECT=")) {
        console.log(`TilHoverProvide -> decoration -> value.text`, value.text);
        ranges.push(
          new Range(
            new Position(value.line, "SOURCE_RECT=".length),
            new Position(value.line, value.text.length)
          )
        );
      }
    });
    window.activeTextEditor.setDecorations(decoTest, ranges);
  };
  hover = () => {
    return languages.registerHoverProvider("til", {
      provideHover(
        document: TextDocument,
        position: Position,
        token: CancellationToken
      ) {
        const fileName = document.fileName;
        const workDir = path.dirname(fileName);
        const word = document.getText(
          document.getWordRangeAtPosition(position)
        );
        const line = document.lineAt(position);

        console.log("====== 进入 provideDefinition 方法 ======");
        console.log("fileName: " + fileName); // 当前文件完整路径
        console.log("workDir: " + workDir); // 当前文件所在目录
        console.log("word: " + word); // 当前光标所在单词
        console.log("line: " + line.text); // 当前光标所在行
        return {
          contents: ["Hover Contenttil"]
        };
      }
    });
  };
}

export default (context: ExtensionContext) => {
  new TilHoverProvide(context);
};
