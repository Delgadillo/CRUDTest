import { Injectable } from '@angular/core'

@Injectable()
export class ErroresService {
  errores: string[] = []
  Agregar(Error: string) {
    this.errores.push(Error)
  }
  Limpiar() {
    this.errores = []
  }
}