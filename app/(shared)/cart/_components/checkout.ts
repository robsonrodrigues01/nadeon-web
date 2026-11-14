// Navegação isolada para o checkout: os testes mockam este módulo, sem navegar de verdade.
export function redirectToCheckout(url: string): void {
  window.location.assign(url);
}
