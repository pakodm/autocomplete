import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedMaterialModule } from './material.module';
import { HelperAutocompleteComponent } from './components/helper-autocomplete/helper-autocomplete.component';
import { HelperAutocompleteService } from './components/helper-autocomplete/helper-autocomplete.service';
import { NgxAutocompleteComponent } from './components/ngx-autocomplete/ngx-autocomplete.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedMaterialModule
    ],
    declarations: [
        HelperAutocompleteComponent,
        NgxAutocompleteComponent
    ],
    exports: [
        SharedMaterialModule,
        HelperAutocompleteComponent,
        NgxAutocompleteComponent
    ],
    providers: [
        HelperAutocompleteService
    ]
})
export class SharedModule { }
