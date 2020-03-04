import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule
 } from '@angular/material';
 
 @NgModule({
    imports: [
       CommonModule,
       MatSnackBarModule,
       MatButtonModule,
       MatToolbarModule,
       MatIconModule,
       MatSidenavModule,
       MatBadgeModule,
       MatListModule,
       MatGridListModule,
       MatFormFieldModule,
       MatInputModule,
       MatSelectModule,
       MatRadioModule,
       MatCheckboxModule,
       MatDatepickerModule,
       MatNativeDateModule,
       MatChipsModule,
       MatTooltipModule,
       MatTableModule,
       MatPaginatorModule
    ],
    exports: [
       MatButtonModule,
       MatToolbarModule,
       MatIconModule,
       MatSidenavModule,
       MatBadgeModule,
       MatBottomSheetModule,
       MatListModule,
       MatGridListModule,
       MatInputModule,
       MatCheckboxModule,
       MatFormFieldModule,
       MatSelectModule,
       MatRadioModule,
       MatDatepickerModule,
       MatChipsModule,
       MatTooltipModule,
       MatTableModule,
       MatPaginatorModule,
       MatSnackBarModule
    ],
    providers: [
       MatDatepickerModule,
    ]
 })
 
 export class MaterialModule { }
