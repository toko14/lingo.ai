import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { themes } from "@/styles/themes"

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
          <Button
            variant="outline"
            onClick={() => setTheme('default')}
            className={`${theme === 'default' ? 'border-gray-500' : ''}`}
          >
            Default
          </Button>
          <Button
            variant="outline"
            onClick={() => setTheme('light')}
            className={`${theme === 'light' ? 'border-blue-500' : ''}`}
          >
            Light
          </Button>
          <Button
            variant="outline"
            onClick={() => setTheme('dark')}
            className={`${theme === 'dark' ? 'border-purple-500' : ''}`}
          >
            Dark
          </Button>
          <Button
            variant="outline"
            onClick={() => setTheme('nature')}
            className={`${theme === 'nature' ? 'border-green-500' : ''}`}
          >
            Nature
          </Button>
          <Button variant="outline">ログイン</Button>
        </div>
      </div>
    </header>
  );
}
