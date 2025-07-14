export function generarFechaLimite() {
  const hoy = new Date();
  let dias = 0;
  while (dias < 2) {
    hoy.setDate(hoy.getDate() + 1);
    if (hoy.getDay() !== 0 && hoy.getDay() !== 6) dias++;
  }
  return hoy.toISOString();
}
