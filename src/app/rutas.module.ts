import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AccederComponent } from './components/acceder/acceder.component'
import { TareasComponent } from './components/tareas/tareas.component'

const rutas: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'Acceder' },
  { path: 'Acceder', component: AccederComponent },
  { path: 'Tareas', component: TareasComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(rutas)],
  exports: [RouterModule]
})

export class RutasModule { }