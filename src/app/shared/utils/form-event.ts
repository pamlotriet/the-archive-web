type FormValueElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function eventValue(event: Event): string {
  return (event.target as FormValueElement).value;
}

export function eventNumber(event: Event): number {
  return Number(eventValue(event)) || 0;
}
