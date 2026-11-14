// Aniversário sem ano: o design pede "MM / DD"; o contrato guarda "--MM-DD".
const MONTH_DAY_INPUT = /^(\d{1,2})\s*\/\s*(\d{1,2})$/;
const STORED_BIRTHDAY = /^(?:\d{4}-|--)(\d{2})-(\d{2})$/;

export function formatBirthday(stored?: string): string {
  const match = stored?.match(STORED_BIRTHDAY);
  return match ? `${match[1]} / ${match[2]}` : "";
}

// undefined = campo vazio (apaga o aniversário); null = inválido.
export function parseBirthday(input: string): string | undefined | null {
  const value = input.trim();
  if (!value) return undefined;

  const match = value.match(MONTH_DAY_INPUT);
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return `--${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
