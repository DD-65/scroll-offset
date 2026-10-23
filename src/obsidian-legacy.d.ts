import 'obsidian';

// Current Obsidian typings omit these legacy CodeMirror 5 hooks.
declare module 'obsidian' {
	interface Plugin {
		registerCodeMirror(callback: (cm: CodeMirror.Editor) => void): void;
	}

	interface Workspace {
		iterateCodeMirrors(callback: (cm: CodeMirror.Editor) => void): void;
	}
}
