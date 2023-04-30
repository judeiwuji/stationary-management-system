import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncateNumber' })
export class TruncateNumberPipe implements PipeTransform {
  transform(value: number, ...args: any[]): string {
    let unit = '';
    let base = 1;

    if (value >= 1000 && value < 1_000_000) {
      base = 1_000;
      unit = 'K';
    } else if (value >= 1_000_000 && value < 1_000_000_000) {
      base = 1_000_000;
      unit = 'M';
    } else if (value > 1_000_000_000) {
      base = 1_000_000_000;
      unit = 'M+';
    } else {
      return `${value}`;
    }
    const result = Math.floor((value / base) * 100) / 100;
    return `${result}${unit}`;
  }
}
