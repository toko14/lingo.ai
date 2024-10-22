import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { themes } from "@/styles/themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className={`${themes[theme as keyof typeof themes]?.background || ''} border-b transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
          <span className={`ml-2 text-xl font-bold ${themes[theme as keyof typeof themes]?.text || ''}`}>/&%#$??!!</span>
        </Link>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                テーマ <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTheme('default')}>
                デフォルト
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                ライト
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                ダーク
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('nature')}>
                ネイチャー
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">ログイン</Button>
        </div>
      </div>
    </header>
  );
}
