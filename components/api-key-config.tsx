"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, Eye, EyeOff, Check, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ApiKeyConfigProps {
  onApiKeyChange: (apiKey: string) => void
}

export default function ApiKeyConfig({ onApiKeyChange }: ApiKeyConfigProps) {
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)

  useEffect(() => {
    // Cargar API key desde localStorage al montar el componente
    const savedApiKey = localStorage.getItem("openai-api-key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
      setHasApiKey(true)
      onApiKeyChange(savedApiKey)
    }
  }, [onApiKeyChange])

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai-api-key", apiKey.trim())
      setHasApiKey(true)
      onApiKeyChange(apiKey.trim())
      setIsOpen(false)
    }
  }

  const handleRemoveApiKey = () => {
    localStorage.removeItem("openai-api-key")
    setApiKey("")
    setHasApiKey(false)
    onApiKeyChange("")
    setIsOpen(false)
  }

  const isValidApiKeyFormat = (key: string) => {
    return key.startsWith("sk-") && key.length > 20
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Settings className="h-4 w-4" />
          Configuración API
          {hasApiKey && <Check className="h-3 w-3 text-green-500 ml-auto" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configuración de OpenAI</DialogTitle>
          <DialogDescription>
            Configura tu API key de OpenAI para comenzar a chatear. Tu clave se guarda localmente en tu navegador.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="api-key">API Key de OpenAI</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {apiKey && !isValidApiKeyFormat(apiKey) && (
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertDescription>
                  La API key debe comenzar con "sk-" y tener al menos 20 caracteres.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <Alert>
            <AlertDescription>
              Tu API key se almacena localmente y nunca se envía a otros servidores excepto a OpenAI.
              Puedes obtener tu API key desde{" "}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                platform.openai.com/api-keys
              </a>
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex gap-2 justify-end">
          {hasApiKey && (
            <Button
              variant="outline"
              onClick={handleRemoveApiKey}
            >
              Eliminar
            </Button>
          )}
          <Button
            onClick={handleSaveApiKey}
            disabled={!apiKey.trim() || !isValidApiKeyFormat(apiKey)}
          >
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}