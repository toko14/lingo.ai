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
          <pre 
            className={`
              whitespace-pre-wrap 
              break-words 
              font-['Helvetica_Neue'] 
              text-xl 
              leading-loose 
              tracking-wider 
              px-4 
              py-2 
              ${themes[theme as keyof typeof themes]?.cardText}
            `}
            style={{
              fontWeight: 400,
              letterSpacing: '0.03em',
              lineHeight: 1.8
            }}
          >
            {text}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
