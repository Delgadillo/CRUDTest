import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { ApiService } from './../api.servicio'

import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { IRespuesta } from './IRespuesta'
import { ISesion } from './ISesion'

import { ErrorService, ManejaError } from './error.service'

@Injectable()
export class SeguridadService {
    // Manejo de errores
    private manejaError: ManejaError

    // Constructor
    constructor(private Api: ApiService, private http: HttpClient, httpError: ErrorService) {
        this.manejaError = httpError.ManejarErroresDe('Serguridad')
    }
    // Registro de un usuario
    Registro(Parametros: Object): Observable<IRespuesta<Object>> {
        // Enviar solicitud
        return this.http.post<IRespuesta<Object>>(this.Api.Seguridad.Registro, Parametros, this.Api.Configuracion()).pipe(
            catchError(this.manejaError('Registro', null))
        )
    }
    // Activa un usuario
    Activacion(Parametros: Object): Observable<IRespuesta<ISesion>> {
        // Enviar solicitud
        return this.http.post<IRespuesta<ISesion>>(this.Api.Seguridad.Activacion, Parametros, this.Api.Configuracion()).pipe(
            catchError(this.manejaError('Activacion', null))
        )
    }
    // Acceder a una sesión
    Acceder(Parametros: Object): Observable<IRespuesta<ISesion>> {
        // Enviar solicitud
        return this.http.post<IRespuesta<ISesion>>(this.Api.Seguridad.Acceder, Parametros, this.Api.Configuracion()).pipe(
            catchError(this.manejaError('Acceder', null))
        )
    }
    // Traer la sesión
    Sesion(): Observable<IRespuesta<ISesion>> {
        return this.http.post<IRespuesta<ISesion>>(this.Api.Seguridad.Sesion, null, this.Api.Configuracion()).pipe(
            catchError(this.manejaError('Sesion', null))
        )
    }

    // Recuperación de cuenta
    Recuperar(Parametros: Object): Observable<IRespuesta<Object>> {
        // Enviar solicitud
        return this.http.post<IRespuesta<Object>>(this.Api.Seguridad.Recuperar, Parametros, this.Api.Configuracion()).pipe(
            catchError(this.manejaError('Recuperar', null))
        )
    }

    // Sale de sesión
    Salir(): Observable<IRespuesta<Object>> {
        // Enviar solicitud
        return this.http.post<IRespuesta<Object>>(this.Api.Seguridad.Salir, null, this.Api.Configuracion()).pipe(
            catchError(this.manejaError('Salir', null))
        )
    }
}