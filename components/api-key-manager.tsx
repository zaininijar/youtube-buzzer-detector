"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Key, Save, Check, X } from "lucide-react"

export function ApiKeyManager() {
  const [apiKey, setApiKey] = useState("")
  const [savedKey, setSavedKey] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Load API key from localStorage on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem("youtube_api_key")
    if (storedKey) {
      setSavedKey(storedKey)
      setApiKey(storedKey)
    }
  }, [])

  const handleSaveKey = () => {
    setError(null)
    setSuccess(false)

    if (!apiKey.trim()) {
      setError("API Key tidak boleh kosong")
      return
    }

    // Simple validation - YouTube API keys are typically around 39 characters
    if (apiKey.length < 20) {
      setError("API Key tidak valid. Pastikan Anda memasukkan key yang benar")
      return
    }

    // Save to localStorage
    localStorage.setItem("youtube_api_key", apiKey)
    setSavedKey(apiKey)
    setSuccess(true)

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("youtube_api_key_changed"))

    // Close modal after a short delay
    setTimeout(() => {
      setShowModal(false)
      setSuccess(false)
    }, 1500)
  }

  const handleClearKey = () => {
    localStorage.removeItem("youtube_api_key")
    setSavedKey("")
    setApiKey("")
    setSuccess(false)
    setError(null)

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("youtube_api_key_changed"))
  }

  // Modal yang lebih sederhana tanpa menggunakan Radix UI
  const renderModal = () => {
    if (!showModal) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 relative">
          <button
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={() => setShowModal(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <div className="mb-4">
            <h2 className="text-lg font-semibold">YouTube API Key</h2>
            <p className="text-sm text-muted-foreground">
              Masukkan YouTube API Key Anda untuk menggunakan fitur scraping komentar YouTube.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Masukkan YouTube API Key Anda"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value)
                  setError(null)
                  setSuccess(false)
                }}
              />
              <p className="text-xs text-muted-foreground">
                Dapatkan API Key dari{" "}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  Google Cloud Console
                </a>
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400">
                <Check className="h-4 w-4" />
                <AlertTitle>Berhasil</AlertTitle>
                <AlertDescription>API Key berhasil disimpan!</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex justify-between mt-6">
            {savedKey && (
              <Button variant="outline" className="gap-1" onClick={handleClearKey}>
                <X className="h-4 w-4" />
                Hapus Key
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button type="submit" className="gap-1" onClick={handleSaveKey}>
                <Save className="h-4 w-4" />
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Button variant="outline" className="gap-2" onClick={() => setShowModal(true)}>
        <Key className="h-4 w-4" />
        {savedKey ? "Ubah YouTube API Key" : "Tambahkan YouTube API Key"}
      </Button>

      {renderModal()}

      {!savedKey && (
        <Card className="mt-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">
                Anda belum menambahkan YouTube API Key. Fitur scraping komentar YouTube tidak akan berfungsi tanpa API
                Key.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

