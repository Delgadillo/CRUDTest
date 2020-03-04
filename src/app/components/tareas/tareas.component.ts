import { Component, ViewChild, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatSidenav } from '@angular/material'
import { ISesion } from './../../servicios/isesion'

import { ApiService } from './../../api.servicio'
import { SeguridadService } from './../../servicios/seguridad.service'
import { TareasService } from './../../servicios/tareas.service'
import { IRespuesta } from 'src/app/servicios/IRespuesta'

// Interfaz modelo de Tarea
export interface ITarea {
  Id?: Number,
  Titulo: String,
  Estado?: String // Hacer, Haciendo, Hecha, Cancelada
  Categoria: String
  Descripcion: String
  Comentarios?: Array<IComentario>
}

export interface IComentario {
  Id: Number
  Estado: Number
  Titular: String
  Comentario: String
  Respuesta: Number
}

const tareas: ITarea[] = [
  {
    Id: 1, 
    Estado: "Haciendo", 
    Titulo: "Página web",
    Categoria: 'Desarrollo', 
    Descripcion: "Programar una página web para .", 
    Comentarios: [
      {
        Id: 1,
        Estado: 1, // Leído
        Titular: "Juan López",
        Comentario: "Éste es un comentario de prueba.",
        Respuesta: 0
      }, {
        Id: 2,
        Estado: 0, // Sin leer
        Titular: "Juan López",
        Comentario: "Éste es otro comentario de prueba.",
        Respuesta: 0
      }, {
        Id: 3,
        Estado: 0, // Sin leer
        Titular: "Juan López",
        Comentario: "Éste es un comentario en respuesta al primer comentario.",
        Respuesta: 1
    }
  ] 
},   {
  Id: 2, 
  Estado: "Haciendo", // Realizando
  Titulo: "Diseño frontend",
  Categoria: 'Arquitectura', 
  Descripcion: "Diseñar layout para dashboard.", 
  Comentarios: [
    {
      Id: 1,
      Estado: 1, // Leído
      Titular: "José Garza",
      Comentario: "Éste es un comentario de prueba.",
      Respuesta: 0
    }, {
      Id: 2,
      Estado: 0, // Sin leer
      Titular: "José Garza",
      Comentario: "Éste es otro comentario de prueba.",
      Respuesta: 0
    }, {
      Id: 3,
      Estado: 0, // Sin leer
      Titular: "José Garza",
      Comentario: "Éste es un comentario en respuesta al primer comentario.",
      Respuesta: 1
  }
] 
}
,{
  Id: 3, 
  Estado: "Haciendo", // Realizando
  Titulo: "Backend func",
  Categoria: 'Programación', 
  Descripcion: "Programar funciones de backend.", 
  Comentarios: [
    {
      Id: 1,
      Estado: 1, // Leído
      Titular: "José Garza",
      Comentario: "Éste es un comentario de prueba.",
      Respuesta: 0
    }, {
      Id: 2,
      Estado: 0, // Sin leer
      Titular: "José Garza",
      Comentario: "Éste es otro comentario de prueba.",
      Respuesta: 0
    }, {
      Id: 3,
      Estado: 0, // Sin leer
      Titular: "José Garza",
      Comentario: "Éste es un comentario en respuesta al primer comentario.",
      Respuesta: 1
  }
] 
}]

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  providers: [ApiService, SeguridadService, TareasService],
  styleUrls: ['./tareas.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})

@Injectable()
export class TareasComponent {
  @ViewChild('alta', null) registrar: MatSidenav
  // Columnas a mostrar
  columnas: string[] = ['Titulo', 'Categoria', 'Descripcion', 'Operación']
  // fila seleccionads como modelo de interfaz ITarea cargado
  filaExpandida: ITarea | null
  // Datos de tareas
  tareas: MatTableDataSource<ITarea>
  // Tarea actual, !Consulta (Alta, Baja, Detalle, Edicion)
  tarea: ITarea
  // Alojar la sesión
  sesion: ISesion
  // Evento para botón agregar
  AgregarTarea() {
    // Inicialziar tarea nueva
    this.tarea = {
      Titulo: "",
      Categoria: "",
      Descripcion: ""
    }
    // Abrir diálogo alta
    let dialogo = this.Dialogo.open(AltaDialog, { width: '400px' })
    // Localizar la instancia actual
    dialogo.componentInstance.ComponenteTareas(this)
    // Al cerrar
    dialogo.afterClosed().subscribe(() => {
      this.Consulta()
    })
  }

  // Evento para botón editar
  EditarTarea(Evento: Event, Tarea: ITarea) {
    // Detener propagción del evento
    Evento.stopPropagation()
    // Seleciconar tarea
    this.tarea = Tarea
    // Abrir diálogo alta
    let dialogo = this.Dialogo.open(EdicionDialog, { width: '400px' })
    // Localizar la instancia actual
    dialogo.componentInstance.ComponenteTareas(this)
    // Al cerrar
    dialogo.afterClosed().subscribe(resultado => {
      this.Consulta()
    })
  }

  // Evento par botón eliminar
  EliminarTarea(Evento: Event, Tarea: ITarea) {
    // Detener propagción del evento
    Evento.stopPropagation()
    // Seleciconar tarea
    this.tarea = Tarea
    // Abrir diálogo baja
    let dialogo = this.Dialogo.open(BajaDialog, { width: '400px' })
    // Localizar la instancia actual
    dialogo.componentInstance.ComponenteTareas(this)
    // Al cerrar
    dialogo.afterClosed().subscribe(resultado => {
      this.Consulta()
    })
  }

  // Para filtrar contenido
  Filtrar(Evento: Event) {
      this.Consulta(() => {
        const texto = (Evento.target as HTMLInputElement).value
        this.tareas.filter = texto.trim().toLowerCase()
      })
  }

  // Consultar tareas
  Consulta(Funcion?: CallableFunction) {
    // Subscribir petición
    this.Tareas.Consulta().subscribe((Respuesta: IRespuesta<ITarea>) => {
      // Hay respuesta del servidor
      if (Respuesta) {
        // Se obuvieron datos
        if (Respuesta.Codigo === 200 || Respuesta.Datos !== null) {
          // Asingar tareas
          this.tareas = new MatTableDataSource(Respuesta.Datos)
          // Hay post función (posiblemente filtrar)
          if (Funcion) {
            Funcion()
          }
          // Mostrar cantidad de registros
          this.Toast.open(Respuesta.Mensaje, null, {
            duration: 3000,
          })
        } else if (Respuesta.Mensaje) {
          this.tareas = null
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

  Sesion(): void {
    this.Seguridad.Sesion().subscribe((Respuesta: IRespuesta<ISesion>) => {
      if (Respuesta) {
        // Se actualizó la sesión
        if (Respuesta.Codigo === 201 || Respuesta.Datos !== null) {
          this.sesion = Respuesta.Datos[0]
          // Actualizar sesión
          this.Api.Sesion(this.sesion)
          // Consultar tareas
          this.Consulta()
        } else {
          // Limpiar la sesión
          localStorage.setItem('Sesion', null)
          this.Toast.open(Respuesta.Mensaje, null, {
            duration: 3000,
          })
          // Redireccionar al componente: Acceder
          this.router.navigate(['/Acceder'])
        }
      } else {
        this.Toast.open("Error en el servidor, intente más tarde", null, {
          duration: 3000,
        })
      }
    })
  }
  
  Alta(Tarea: ITarea): void {
    // Mensaje de error
    var error: string;
    
    // Validar la descripción
    if (!Tarea.Descripcion) {
      error = "Agrega una descripción a la tarea."
    }
    
    // Validar la categoria
    if (!Tarea.Categoria.trim()) {
      error = "Selecciona la categoría."
    }
    
    // Validar el título
    if (!Tarea.Titulo.trim()) {
      error = "Falta el título de la tarea."
    }
    // Hay algún error
    if (error) {
      this.Toast.open(error, null, {
        duration: 3000,
      })
      // No se puede continuar
      return
    }

    this.Tareas.Alta(Tarea).subscribe((Respuesta: IRespuesta<Object>) => {
      // Hay respuesta del servidor
      if (Respuesta) {
        // Se creó la tarea
        if (Respuesta.Codigo === 201 || Respuesta.Datos !== null) {
          // Cerrar diálogos
          this.Dialogo.closeAll()
          // Mostrar mensaje de guardado correcto y cerrar diálogo
          this.Toast.open(Respuesta.Mensaje, null, {
              duration: 3000,
          })
        } else {
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

  Baja(Tarea: ITarea): void {
    // Validar el id
    if (!this.tarea) {
      this.Toast.open("Primero selecciona una tarea.", null, {
        duration: 3000,
      })
      // No se puede continuar sin Id
      return
    }

    this.Tareas.Baja(this.tarea).subscribe((Respuesta: IRespuesta<Object>) => {
      // Hay respuesta del servidor
      if (Respuesta) {
        // Se eliminó la tarea
        if (Respuesta.Codigo === 201 || Respuesta.Datos !== null) {
          // Cerrar diálogos
          this.Dialogo.closeAll()
          // Mostrar mensaje
          this.Toast.open(Respuesta.Mensaje, null, {
            duration: 3000,
          })
        } else {
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

  Edicion(Tarea: ITarea): void {
    // Mensaje de error
    var error: string;
    
    // Validar la descripción
    if (!this.tarea.Descripcion) {
      error = "La descripción de tarea está vacía."
    }
    
    // Validar la categoria
    if (!this.tarea.Categoria.trim()) {
      error = "Selecciona una categoría."
    }
    
    // Validar el título
    if (!this.tarea.Titulo.trim()) {
      error = "Falta el título de la tarea."
    }

    // Hay algún error
    if (error) {
      this.Toast.open(error, null, {
        duration: 3000,
      })
      // No se puede continuar
      return
    }
    
    this.Tareas.Edicion(Tarea).subscribe((Respuesta: IRespuesta<Object>) => {
      // Hay respuesta del servidor
      if (Respuesta) {
        // Se creó la tarea
        if (Respuesta.Codigo === 201 || Respuesta.Datos !== null) {
          // Cerrar diálogos
          this.Dialogo.closeAll()
          // Mostrar mensaje de guardado correcto y cerrar diálogo
          this.Toast.open(Respuesta.Mensaje, null, {
              duration: 3000,
          })
        } else {
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

  Salir(): void {
    this.Seguridad.Salir().subscribe((Respuesta: IRespuesta<Object>) => {
      // Eliminar la sesión local
      localStorage.setItem('Sesion', null)
      // Hay respuesta del servidor
      if (Respuesta) {
        // Se cerró la sesión
        if (Respuesta.Codigo === 201 || Respuesta.Datos !== null) {
          // Mostrar mensaje de salida y redireccionar
          this.Toast.open(Respuesta.Mensaje, null, {
            duration: 3000,
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
        this.Toast.open("Error de sesión, cerrando...", null, {
          duration: 3000,
        })
      }
      // Redireccionar al componente: Acceder
      this.router.navigate(['/Acceder'])
    })
  }

  constructor(
    private Api: ApiService, 
    public Seguridad: SeguridadService,
    public Tareas: TareasService,
    public Toast: MatSnackBar,
    private Dialogo: MatDialog,
    private router: Router
  ) {
    // Validar la sesión al obtener el API
    this.Api.Obtener(() => {
      // Validar la sesión
      this.Sesion()
    })
  }
}

@Component({
  selector: 'app-alta',
  templateUrl: 'alta.dialog.html',
  styleUrls: ['./tareas.component.css'],
})

export class AltaDialog {
  // Componente tareas
  private componenteTareas: TareasComponent
  // Datos de tarea 
  tarea : ITarea
  // Constructor
  constructor(private dialogo: MatDialogRef<AltaDialog>) {
    this.tarea = {
      Titulo: '',
      Categoria: '',
      Descripcion: ''
    }
  }
  // Traer a contexto el componente tareas
  public ComponenteTareas (ComponenteTareas: TareasComponent) {
    this.componenteTareas = ComponenteTareas
  }

  // Dar de alta la tarea
  Alta(): void {
    // Tareas.Alta
    this.componenteTareas.Alta(this.tarea)
  }

  // Cerrar diálogo
  Cancelar(): void {
    this.dialogo.close()
  }
}

@Component({
  selector: 'app-baja',
  templateUrl: 'baja.dialog.html',
  styleUrls: ['./tareas.component.css'],
})

export class BajaDialog {
  // Componente tareas
  private componenteTareas: TareasComponent
  // Datos de tarea 
  tarea : ITarea
  // Constructor
  constructor(private dialogo: MatDialogRef<BajaDialog>) {}
  // Traer a contexto el componente tareas
  public ComponenteTareas (ComponenteTareas: TareasComponent) {
    this.componenteTareas = ComponenteTareas
    // Tarea en cuestión
    this.tarea = this.componenteTareas.tarea
  }

  // Dar de baja la tarea
  Baja(): void {
    // Tareas.Baja
    this.componenteTareas.Baja(this.tarea)
  }

  // Cerrar diálogo
  Cancelar(): void {
    this.dialogo.close()
  }
}


@Component({
  selector: 'app-edicion',
  templateUrl: 'edicion.dialog.html',
  styleUrls: ['./tareas.component.css'],
})

export class EdicionDialog {
  // Componente tareas
  private componenteTareas: TareasComponent
  // Datos de tarea 
  tarea : ITarea
  // Constructor
  constructor(private dialogo: MatDialogRef<EdicionDialog>) {}
  // Traer a contexto el componente tareas
  public ComponenteTareas (ComponenteTareas: TareasComponent) {
    this.componenteTareas = ComponenteTareas
    // tarea en cuestión
    this.tarea = this.componenteTareas.tarea
  }

  // Editar la tarea
  Editar(): void {
    // Tareas.Edicion
    this.componenteTareas.Edicion(this.tarea)
  }

  // Cerrar diálogo
  Cancelar(): void {
    this.dialogo.close()
  }
}