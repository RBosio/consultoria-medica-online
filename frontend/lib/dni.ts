export function showDni(dni: string) {
  return dni
    .split("")
    .map((l, i) => {
      if (i === 2 || i === 5) {
        return "." + l;
      }

      return l;
    })
    .join("");
}
