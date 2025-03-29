import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <AlertTriangle className="h-6 w-6 text-primary" />
      <span className="font-bold text-xl hidden md:inline-block">Buzzer Detector</span>
    </Link>
  )
}

