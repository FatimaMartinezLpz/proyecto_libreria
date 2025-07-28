// src/app/pipes/format-instructions.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatInstructions',
  standalone: true // Esto es importante para Angular 15+
})
export class FormatInstructionsPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Reemplaza saltos de línea por <br>
    let formatted = value.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
    
    // Opcional: Numerar los pasos si están separados por números
    formatted = formatted.replace(/(\d+\.)/g, '<br><strong>$1</strong>');
    
    return formatted;
  }
}