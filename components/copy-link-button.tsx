// components/copy-link-button.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyLinkButtonProps {
  url: string
}

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button 
      variant="secondary" 
      onClick={handleCopy}
      disabled={copied}
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Copiado
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          Copiar Enlace
        </>
      )}
    </Button>
  )
}