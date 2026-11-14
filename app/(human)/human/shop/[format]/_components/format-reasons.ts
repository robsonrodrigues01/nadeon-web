// Motivos "Why this format". RASCUNHO vindo do board: só o formato capsules tem
// texto no board (as linhas de exemplo entre colchetes). Powders e tinctures não
// têm texto, então o bloco não aparece neles. Texto aprovado pendente.
export interface FormatReason {
  title: string;
  body: string;
}

const REASONS_BY_FORMAT: Record<string, readonly FormatReason[]> = {
  capsules: [
    { title: "Morning routine", body: "Fits a morning routine." },
    { title: "No taste", body: "No taste, no mixing." },
    { title: "Pre-measured dose", body: "Pre-measured dose." },
  ],
};

export function getFormatReasons(slug: string): readonly FormatReason[] {
  return REASONS_BY_FORMAT[slug] ?? [];
}
