import { Pipe, PipeTransform } from '@angular/core';
import { Libro } from '../services/book';

@Pipe({
    name: 'filterBySubcategory',
    standalone: true
})
export class FilterBySubcategoryPipe implements PipeTransform {
    transform(libros: Libro[], subcategoria: string): Libro[] {
        if (!libros || !subcategoria) return libros;
        return libros.filter(libro =>
            libro.category?.toLowerCase().includes(subcategoria.toLowerCase())
        );
    }
}