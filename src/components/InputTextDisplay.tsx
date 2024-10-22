import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { themes } from "@/styles/themes";

interface InputTextDisplayProps {
  text: string;
}

export default function InputTextDisplay({ text }: InputTextDisplayProps) {
  const { theme } = useTheme();

  return (
    <Card className={`${themes[theme as keyof typeof themes]?.card} ${themes[theme as keyof typeof themes]?.cardBorder} border h-full`}>
      <CardHeader>
        <CardTitle className={themes[theme as keyof typeof themes]?.cardText}>入力されたテキスト</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100% - 60px)', minHeight: '200px' }}>
          <pre className={`whitespace-pre-wrap break-words ${themes[theme as keyof typeof themes]?.cardText}`}>{text}</pre>
        </div>
      </CardContent>
    </Card>
  );
}
