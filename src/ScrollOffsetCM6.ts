import {ViewPlugin, ViewUpdate, EditorView} from '@codemirror/view';
import { Prec } from '@codemirror/state'

const eventHandlers = {
  mousedown(event: MouseEvent, view: EditorView) {
    this.switch = false;
  },
  keydown(event: KeyboardEvent, view: EditorView) {
    this.switch = true;
  },
}

function generateScrollOffsetCM6Plugin(calcRequiredOffset: (container: HTMLElement, cursorHeight: number) => number) {
  return Prec.highest(ViewPlugin.fromClass(class {
    margin = 200;
    switch = true;
  
    constructor(_view: EditorView) {}
  
    update(_update: ViewUpdate) {
      if (!_update.selectionSet) return ;

      const view = _update.view;

      view.requestMeasure({
        read: () => {
          return {
            cursor: view.coordsAtPos(view.state.selection.main.head),
          }
        },
        write: ({cursor}) => {
          if (!cursor) return ;

          if (this.switch) {
            const cursorHeight = cursor.bottom - cursor.top
            const requiredOffset = calcRequiredOffset(view.scrollDOM, cursorHeight)

            this.margin = requiredOffset;
          } else {
            this.margin = 0;
          }
        },
      })
    }
  }, 
  {
    eventHandlers,
    provide: plugin => EditorView.scrollMargins.of(view => {
      const value = view.plugin(plugin)
      return {
        top: value.margin,
        bottom: value.margin
      }
    })
  }))
}

export default generateScrollOffsetCM6Plugin