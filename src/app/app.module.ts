import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { RutasModule } from './rutas.module'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { MaterialModule } from './material.module';
import { ErrorService } from './servicios/error.service'
import { SeguridadService } from './servicios/seguridad.service'
import { ErroresService } from './servicios/errores.service'
import { ApiService } from './api.servicio'
import { AccederComponent, RecuperarDialog, ActivarDialog } from './components/acceder/acceder.component';
import { TareasComponent, AltaDialog, BajaDialog, EdicionDialog } from './components/tareas/tareas.component';
import { TareasService } from './servicios/tareas.service'

export const opciones : Partial<IConfig> | (() => Partial<IConfig>) = {}

@NgModule({
  entryComponents: [RecuperarDialog, ActivarDialog, AltaDialog, BajaDialog, EdicionDialog],
  declarations: [
    AppComponent,
    RecuperarDialog,
    ActivarDialog,
    AltaDialog,
    BajaDialog,
    EdicionDialog,
    AccederComponent,
    TareasComponent
  ],
  imports: [
    NgxMaskModule.forRoot(opciones),
    FlexLayoutModule,
    BrowserModule,
    RutasModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ApiService, SeguridadService, ErrorService, ErroresService, TareasService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
