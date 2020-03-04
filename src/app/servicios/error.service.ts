import { Injectable } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { ErroresService } from './errores.service'

export type ManejaError = <T> (Funcion?: string, Resultado?: T) => (Error: HttpErrorResponse) => Observable<T>

@Injectable()
export class ErrorService {
  constructor(private erroresService: ErroresService) { }

  ManejarErroresDe = (Modulo = '') => <T>
    (Funcion = '(Función)', Resultado = {} as T) => this.handleError(Modulo, Funcion, Resultado)
  handleError<T> (Modulo = '', Funcion = '(Función)', Resultado = {} as T) {
    return (Error: HttpErrorResponse): Observable<T> => {
      // Aqui programar un módulo para enviar el error al servidor
      console.error(Error)

      // Detener ciclo de objeto error
      let mensaje
      if (Error.error instanceof ErrorEvent) {
        mensaje = Error.error.message
      } else {
        mensaje = "Error (" + Error.status + "): '"  + Error.error + "'"
      } 

      // Agregar al servicio de errores
      this.erroresService.Agregar(Modulo + "::" + Funcion + " Falló:" + mensaje + "")
      return of(Resultado)
    }
  }
}