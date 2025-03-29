"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AlertTriangle } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
            <AlertTriangle className="h-6 w-6 text-primary" />
            <span className="font-bold">Buzzer Detector</span>
          </Link>
        </div>
        <div className="flex flex-col space-y-3 mt-8 px-7">
          <Link href="/" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
            Beranda
          </Link>
          <Link href="#tentang" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
            Tentang
          </Link>
          <Link href="#panduan" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
            Panduan
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}

