import Clipboard from 'clipboard'
import { useNotify } from '../components/Notify'

function clipboardSuccess() {
  const notify = useNotify()
  notify({ message: '已复制！' })
}

function clipboardError() {
  const notify = useNotify()
  notify({ title: '错误提示', message: '复制异常！' })
}

export function handleClipboard(text: string, event: Event) {
  console.log('event', event)
  const clipboard = new Clipboard(event.target as Element, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.destroy()
  })

  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })

  { (clipboard as any).onClick(event) }
}
