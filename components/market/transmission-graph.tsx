import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TransmissionGraph({
  title,
  links
}: {
  title: string;
  links: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 lg:grid-cols-4">
          {links.map((link, index) => (
            <div key={link} className="relative rounded-2xl border border-border/70 bg-muted/20 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Step {index + 1}</div>
              <p className="mt-2 text-sm font-medium leading-6">{link}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
