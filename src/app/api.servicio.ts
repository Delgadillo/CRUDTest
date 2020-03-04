// Módulos externos requeridos
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { HttpErrorResponse } from '@angular/common/http'
import { throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ISesion } from './servicios/isesion'

// Interfaz modelo para API
export interface IAPI {
    Servidor: IServidor,
    Seguridad: ISeguridad
    Tareas: IModulo
}

// Interfaz puntual para módulo de API 
export interface IServidor {
    Anfitrion: string
    Protocolo: string
    SSL: Boolean
    Puerto: Number
    Version: string
}

// Interfaz puntual para módulo de API 
export interface ISeguridad {
    Registro: string
    Activacion: string
    Acceder: string
    Sesion: string
    Recuperar: string
    Salir: string
}

// Interfaz abstracta para módulos de API
export interface IModulo {
    Alta: string
    Baja: string
    Consulta: string
    Detalle: string
    Edicion: string
}

// Definición del módulo
@Injectable()
export class ApiService {
    // Ruta de apis
    private api = "assets/api.json"
    // Módulos
    Servidor: IServidor
    Seguridad: ISeguridad
    Tareas: IModulo
    // Obtener o establecer la sesión local
    Sesion(Sesion?: ISesion) {
        // Se indicó sesión
        if (Sesion) {
            // Guardar
            localStorage.setItem('Sesion', JSON.stringify(Sesion))
        }
        // Cargar sesión local
        var sesion = JSON.parse(localStorage.getItem('Sesion'))
        // Retornar la sesión
        return sesion
    }

    Configuracion() {
        // Obtener token de acceso a sesión
        var acceso = ""
        var sesion = this.Sesion()
        // Es una sesión válida
        if (sesion) {
            // Hay un token de acceso usado
            if (sesion.Acceso) {
                acceso = sesion.Acceso
            }
        }
        // Preparar configuración
        var configuracion = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Acceso': acceso
            })
        }
        // Retornar configuración
        return configuracion
    }

    // 
    private Error(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // Manejar error e lado del cliente
            console.error('No se alcanzó el servidor:', error.error.message)
        } else {
            console.error('EL servidor respondió: (' + error.status + ') ' + error.error)
        }
        return throwError('Error de conexión, Por favor intenta de nuevo.')
    }
      
    constructor(private http: HttpClient) {
        // Obtener
        this.Obtener()
    }

    public Obtener(Continuar?: Function) {
        this.http.get<IAPI>(this.api)
        .pipe(
            catchError(this.Error)
        )
        .subscribe((Api: IAPI) => {
            // Obtener parámetros de servidor
            var servidor = Api.Servidor
            Object.keys(Api).forEach((Modulo) => {
                if (// ¿No es documentacion?, 
                    Modulo.indexOf("---") !== 0 && 
                    // ni ¿Parámetros el servidor?
                    Api[Modulo] !== servidor && 
                    // y ¿Cuenta con funciones el módulo?
                    Object.keys(Api[Modulo]).length > 0
                ) {
                    // Recorrer y formatear las rutas
                    Object.keys(Api[Modulo]).forEach((Ruta) => {
                        // Formato con protocolo
                        var ruta = Api.Servidor.Protocolo
                        // El protocolo llevará seguridad
                        if (Api.Servidor.SSL) {
                            // Agregar la s de segurida
                            ruta += 's'
                        }
                        // Agregar formato web
                        ruta += '://'
                        // Agregar host
                        ruta += (Api.Servidor.Anfitrion !== "" ? Api.Servidor.Anfitrion : "localhost")
                        // Agregar puerto y ruta de api
                        ruta += (Api.Servidor.Puerto ? ":" + Api.Servidor.Puerto : "") + "/api"
                        // Versionado del api
                        ruta += (Api.Servidor.Version) ? 'v' + Api.Servidor.Version : ''
                        // Formato del módulo y función
                        ruta += "/" + Modulo + "/" + Ruta
                        // Aignar la ruta
                        Api[Modulo][Ruta] = ruta
                    })
                }
            })
            // Preparar la ruta del servidor
            this.Servidor = Api.Servidor
            this.Seguridad = Api.Seguridad
            this.Tareas = Api.Tareas
            Continuar ? Continuar() : null
        })
    }
}