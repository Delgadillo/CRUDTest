import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { ApiService } from './../api.servicio'

import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { IRespuesta } from './IRespuesta'

import { ErrorService, ManejaError } from './error.service'
import { ITarea } from '../components/tareas/tareas.component'

@Injectable()
export class TareasService {
    // Manejo de errores
    private manejaError: ManejaError

    // Constructor
    constructor(private Api: ApiService, private http: HttpClient, httpError: ErrorService) {
        this.manejaError = httpError.ManejarErroresDe('TareasService')
    }
    // Alta de una tarea
    Alta(Parametros: ITarea): Observable<IRespuesta<Object>> {
        // Enviar solicitud
        return this.http.post<IRespuesta<Object>>(this.Api.Tareas.Alta, Parametros, this.Api.Configuracion()).pipe(
            catchError(this.manejaError('Alta', null))
        )
    }
    // Baja de una tarea
    Baja(Parametros: ITarea): Observable<IRespuesta<Object>> {
        // Configurar eliminación
        var configuracion = this.Api.Configuracion()
        // Pasar tarea
        configuracion["body"] = Parametros
        // Enviar solicitud
        return this.http.delete<IRespuesta<Object>>(this.Api.Tareas.Baja, configuracion).pipe(
            catchError(this.manejaError('Baja', null))
        )
    }
    // Consulta de tareas
    Consulta(): Observable<IRespuesta<ITarea>> {
        // Enviar solicitud
        return this.http.get<IRespuesta<ITarea>>(this.Api.Tareas.Consulta, this.Api.Configuracion()).pipe(
            catchError(this.manejaError('Consulta', null))
        )
    }
    // Detalle de una tarea
    Detalle(Parametros: Object): Observable<IRespuesta<ITarea>> {
        // Configurar eliminación
        var configuracion = this.Api.Configuracion()
        // Pasar tarea
        configuracion["body"] = Parametros
        return this.http.get<IRespuesta<ITarea>>(this.Api.Tareas.Detalle, configuracion).pipe(
            catchError(this.manejaError('Detalle', null))
        )
    }

    // Edición de tarea
    Edicion(Parametros: ITarea): Observable<IRespuesta<Object>> {
        // Enviar solicitud
        return this.http.put<IRespuesta<Object>>(this.Api.Tareas.Edicion, Parametros, this.Api.Configuracion()).pipe(
            catchError(this.manejaError('Edicion', null))
        )
    }
}