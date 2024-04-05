export function generateString(text: string): string {
  return text
    .normalize("NFD")
    .toLocaleLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}
