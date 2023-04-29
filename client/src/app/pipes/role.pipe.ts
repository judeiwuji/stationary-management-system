import { Pipe, PipeTransform } from '@angular/core';
import { Roles } from '../model/roles';

@Pipe({ name: 'role' })
export class RolePipe implements PipeTransform {
  transform(value: number, ...args: any[]) {
    return Roles[value].toLowerCase().split('_').join(' ');
  }
}
