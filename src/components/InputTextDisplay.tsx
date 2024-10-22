import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface InputTextDisplayProps {
  text: string;
}

export default function InputTextDisplay({ text }: InputTextDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>入力されたテキスト</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{text}</p>
      </CardContent>
    </Card>
  );
}
