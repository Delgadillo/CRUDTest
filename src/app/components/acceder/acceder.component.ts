import { Component, ViewChild, Inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatSidenav } from '@angular/material'
import { Router } from '@angular/router'
import { DateAdapter } from '@angular/material/core'

import { ISesion } from './../../servicios/isesion'
import { IActivar } from './../../servicios/iactivar'

import { ApiService } from './../../api.servicio'
import { SeguridadService } from './../../servicios/seguridad.service'
import { IRespuesta } from 'src/app/servicios/IRespuesta'

import { MatDialog, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-acceder',
  templateUrl: './acceder.component.html',
  providers: [ApiService, SeguridadService],
  styleUrls: ['./acceder.component.css']
})

@Injectable()
export class AccederComponent {
  @ViewChild('registrar', null) registrar: MatSidenav
  // Datos de la sesión
  sesion = {
    Usuario: (localStorage.getItem('Recordar') ? localStorage.getItem('Recordar') : ''),
    Clave: '',
    Recordar: true
  }
  // Datos de activación
  activar: IActivar
  // Datos de recuperación
  recuperar: {
    Telefono
  }
  // Máscara para el campo fecha de nacimiento 
  nacimiento = "00/00/0000"
  telefono = "00 00 00 00 00"
  registro = {
    Titular: "",
    Nacimiento: "",
    Telefono: "",
    Genero: ""
  }
  
  Acceder(): void {
    // Mensaje de error
    var error: string
    
    // Validar la clave
    if (!this.sesion.Clave) {
      error = "La clave no es válida."
    }
    
    // Validar la categoria
    if (!this.sesion.Usuario.trim()) {
      error = "El usuario no es válido."
    }
    
    // Hay algún error
    if (error) {
      this.Toast.open(error, null, {
        duration: 3000,
      })
      // No se puede continuar
      return
    }
    // Subscribir petición
    this.Seguridad.Acceder(this.sesion).subscribe((Respuesta: IRespuesta<ISesion>) => {
      // Hay respuesta del servidor
      if (Respuesta) {
        // Se creó la sesión
        if (Respuesta.Codigo === 201 || Respuesta.Datos !== null) {
          // Guardar sesión
          this.Api.Sesion(Respuesta.Datos[0])
          // Mostrar mensaje de bienvenida y redireccionar
          this.Toast.open(Respuesta.Mensaje, null, {
            duration: 1000,
          }).afterDismissed().subscribe(() => {
            // Redireccionar a ruta /Tareas
            this.router.navigate(['/Tareas'])
          })
        } else {
          // Limpiar la sesión
          localStorage.setItem('Sesion', null)
          // Mostrar mensaje de error
          if (Respuesta.Mensaje) {
            this.Toast.open(Respuesta.Mensaje, "Recuperar acceso", {
              duration: 3000,
            }).onAction().subscribe(() => {
              // Obtener teléfono
              this.recuperar = { Telefono: this.sesion.Usuario }
              // Limpiar datos de registro
              this.registro.Titular = ""
              this.registro.Nacimiento = ""
              this.registro.Telefono = ""
              this.registro.Genero = ""
              // Ocultar formulario de registro
              this.registrar.close()
              // Abrir el diálogo de recuperación
              this.Recuperar()
            })
          }
        }
      } else {
        this.Toast.open("El servidor no responde, intenta más tarde.", null, {
          duration: 3000,
        })
      }
    })
  }

  Sesion(): void {
    this.Seguridad.Sesion().subscribe((Respuesta: IRespuesta<ISesion>) => {
      if (Respuesta) {
        // Se actualizó la sesión
        if (Respuesta.Codigo === 201 || Respuesta.Datos !== null) {
          // Actulizar sesión
          this.Api.Sesion(Respuesta.Datos[0])
          // Mostrar mensaje de bienvenida y redireccionar
          this.Toast.open(Respuesta.Mensaje, null, {
            duration: 3000,
          }).afterDismissed().subscribe(() => {
            // Redireccionar al componente: Tareas
            this.router.navigate(['/Tareas'])
          })
        } else {
          // Limpiar la sesión
          localStorage.setItem('Sesion', null)
        }
      } else {
        this.Toast.open("Error en el servidor, intente más tarde", null, {
          duration: 3000,
        })
      }
    })
  }
  
  Registrar(): void {
    // Mensaje de error
    var error: string
    
    // Validar el genero
    if (!this.registro.Genero.trim()) {
      error = "Selecciona tu género."
    }

    // Validar el teléfono
    if (!this.registro.Telefono.trim()) {
      error = "Falta tu número celular."
    }

    // Validar el nacimiento
    if (!this.registro.Nacimiento) {
      error = "Selecciona tu fecha de nacimiento."
    }

    // Validar el nombre
    if (!this.registro.Titular.trim()) {
      error = "El campo titular no es válido."
    }

    // Hay algún error
    if (error) {
      this.Toast.open(error, null, {
        duration: 3000,
      })
      // No se puede continuar
      return
    }

    this.Seguridad.Registro(this.registro).subscribe((Respuesta: IRespuesta<IActivar>) => {
      // Hay respuesta del servidor
      if (Respuesta) {
        // Se creó la sesión
        if (Respuesta.Codigo === 201 || Respuesta.Datos !== null) {
          // Limpiar datos de registro
          this.registro.Titular = ""
          this.registro.Nacimiento = ""
          this.registro.Telefono = ""
          this.registro.Genero = ""
          // Ocultar formulario de registro
          this.registrar.close()
          // Obtener datos de activación
          this.activar = Respuesta.Datos[0]
          // Mostrar mensaje
          this.Toast.open(Respuesta.Mensaje, null, {
            duration: 3000,
          }).afterDismissed().subscribe(() => {
            // Abrir el diálogo de recuperación
            this.Activacion()
          })
        } else if (Respuesta.Codigo === 409) {
          // Mostrar mensaje de error
          this.Toast.open(Respuesta.Mensaje, "Recuperar tu cuenta", {
            duration: 3000,
          }).onAction().subscribe(() => {
            // Obtener teléfono
            this.recuperar = { Telefono: this.registro.Telefono }
            // Limpiar datos de registro
            this.registro.Titular = ""
            this.registro.Nacimiento = ""
            this.registro.Telefono = ""
            this.registro.Genero = ""
            // Ocultar formulario de registro
            this.registrar.close()
            // Abrir el diálogo de recuperación
            this.Recuperar()
          })
        } else {
          // Mostrar mensaje de error
          if (Respuesta.Mensaje) {
            this.Toast.open(Respuesta.Mensaje, null, {
              duration: 3000,
            })
          }
        }
      } else {
        this.Toast.open("El servidor no responde, intenta más tarde.", null, {
          duration: 3000,
        })
      }
    })
  }

  constructor(
    private Api: ApiService, 
    public Seguridad: SeguridadService, 
    public Toast: MatSnackBar, 
    private dateAdapter: DateAdapter<any>,
    private router: Router,
    private Dialogo: MatDialog
  ) {
    // Ajustar localidad de calendario
    this.dateAdapter.setLocale('es-MX')
    // Validar la sesión al obtener el API
    this.Api.Obtener(() => {
      this.Sesion()
    })
  }

  // Iniciar diálogo e recuperación
  Recuperar(): void {
    let dialogo = this.Dialogo.open(RecuperarDialog, { width: '250px' })
    // Localizar la instancia actual
    dialogo.componentInstance.ComponenteAcceder(this)
  }

  // Iniciar diálogo de activación
  Activacion(): void {
    let dialogo = this.Dialogo.open(ActivarDialog, { width: '250px' })
    // Localizar la instancia actual
    dialogo.componentInstance.ComponenteAcceder(this)
  }

  // Activar cuenta
  Activar(): void {
    // Acceder.Seguridad.Recuperar
    this.Seguridad.Activacion(this.activar).subscribe((Respuesta: IRespuesta<ISesion>) => {
      // Hay respuesta del servidor
      if (Respuesta) {
        // Se creó la sesión
        if (Respuesta.Codigo === 201 || Respuesta.Datos !== null) {
          // Guardar sesión
          this.Api.Sesion(Respuesta.Datos[0])
          // Mostrar mensaje de bienvenida y redireccionar
          if (Respuesta.Mensaje) {
            this.Toast.open(Respuesta.Mensaje, null, {
              duration: 3000,
            })
          }
          // Cerrar diálogos (activación)
          this.Dialogo.closeAll()
          // Redireccionar al componente: Tareas
          this.router.navigate(['/Tareas'])
        } else {
          // Limpiar la sesión
          localStorage.setItem('Sesion', null)
          // Mostrar mensaje de error
          if (Respuesta.Mensaje) {
            this.Toast.open(Respuesta.Mensaje, null, {
              duration: 3000,
            })
          }
        }
      } else {
        this.Toast.open("El servidor no responde, intenta más tarde.", null, {
          duration: 3000,
        })
      }
    })
  }
  // Solicitar recuperación
  Solicitar(Recuperar): void {
    // Acceder.Seguridad.Recuperar
    this.Seguridad.Recuperar(Recuperar).subscribe((Respuesta: IRespuesta<IActivar>) => {
      // Hay respuesta del servidor
      if (Respuesta) {
        // Se creó la sesión
        if (Respuesta.Codigo === 201 || Respuesta.Datos !== null) {
          // Cerrar diálogos
          this.Dialogo.closeAll()
          // Mostrar mensaje de inicio de recuperación
          this.Toast.open(Respuesta.Mensaje, null, {
            duration: 3000,
          }).afterDismissed().subscribe(() => {
            // Obtener datos de activación
            this.activar = Respuesta.Datos[0]
            // Iniciar activación
            this.Activacion()
          })
        } else {
          // Limpiar la sesión
          localStorage.setItem('Sesion', null)
          // Mostrar mensaje de error
          this.Toast.open(Respuesta.Mensaje, null, {
            duration: 3000,
          })
        }
      } else {
        this.Toast.open("El servidor no responde, intenta más tarde.", null, {
          duration: 3000,
        })
      }
    })
  }

  ngOnInit(): void {
    // Validar sesión
    // this.Sesion()
  }
}

@Component({
  selector: 'app-recuperar',
  templateUrl: 'recuperar.dialog.html',
})

export class RecuperarDialog {
  // Componente acceder
  private componenteAcceder: AccederComponent
  // Datos de recuperación 
  recuperar = {
    Telefono: ""
  }
  // Máscara del número telefónico
  telefono = "00 00 00 00 00"
  // Constructor
  constructor(private dialogo: MatDialogRef<RecuperarDialog>) {}
  
  // Traer al contexto el componente acceder
  public ComponenteAcceder (ComponenteAcceder: AccederComponent) {
    this.componenteAcceder = ComponenteAcceder
    this.recuperar.Telefono = this.componenteAcceder.recuperar.Telefono
  }

  // Solicitar recuperación
  Solicitar(): void {
    // Seguridad.Recuperar
    this.componenteAcceder.Solicitar(this.recuperar)
  }

  // Cerrar diálogo
  Cancelar(): void {
    this.dialogo.close()
  }
}


@Component({
  selector: 'app-activar',
  templateUrl: 'activar.dialog.html',
})

export class ActivarDialog {
  // Componente acceder
  private componenteAcceder: AccederComponent
  // Datos de activación
  activar: IActivar
  // Máscara del código que llegará por SMS
  codigo = "AAA - AAA"
  // Máscara del número telefónico
  telefono = "00 00 00 00 00"
  // Constructor
  constructor(private dialogo: MatDialogRef<ActivarDialog>) {}
  
  // Traer al contexto el componente acceder
  public ComponenteAcceder (ComponenteAcceder: AccederComponent) {
    this.componenteAcceder = ComponenteAcceder
    this.activar = this.componenteAcceder.activar
  }

  // Solicitar activación
  Activar(): void {
    // Seguridad.Activar
    this.componenteAcceder.Activar()
  }

  // Cerrar diálogo
  Cancelar(): void {
    this.dialogo.close()
  }
}