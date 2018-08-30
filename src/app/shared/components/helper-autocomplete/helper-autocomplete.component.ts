import {
  Component, Input, forwardRef, Optional, Host,
  SkipSelf, OnInit, AfterContentInit, Output, EventEmitter, ViewChild, ViewContainerRef, OnDestroy
} from '@angular/core';
import {
  FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR,
  ControlContainer, NG_VALIDATORS, Validator, FormGroupDirective, NgForm
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { FormGroup } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { HelperAutocompleteService } from './helper-autocomplete.service';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorStateMatcher } from '@angular/material';

export const HELPER_AUTOCOMPLETE_VALUE_ACCESOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line:no-use-before-declare
  useExisting: forwardRef(() => HelperAutocompleteComponent),
  multi: true
};

export const HELPER_AUTOCOMPLETE_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  // tslint:disable-next-line:no-use-before-declare
  useExisting: forwardRef(() => HelperAutocompleteComponent),
  multi: true,
};

const noop = () => {
};

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

/**
 * @title Autocomplete overview
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'helper-autocomplete',
  templateUrl: './helper-autocomplete.component.html',
  styleUrls: ['./helper-autocomplete.component.scss'],
  providers: [HELPER_AUTOCOMPLETE_VALUE_ACCESOR, HELPER_AUTOCOMPLETE_VALIDATORS, HelperAutocompleteService]
})
export class HelperAutocompleteComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  @Input() source: Array<any>;
  @Input() placeholder = 'Original';
  @Input() formControlName: string;
  @Input() keyValue: string;
  @Input() keyDisplay: string;
  @Input() required = false;
  @Input() errorMessage = 'El elemento no existe';
  @Input() extraWidth = false;
  msnError;
  @Input() uri: string;
  @Input() object: string;
  private service$ = new BehaviorSubject(this.source);
  @Output() OnChangeValue: EventEmitter<any> = new EventEmitter<any>();
  @Output() OnFocusLost: EventEmitter<any> = new EventEmitter<any>();
  disabled = false;
  @Input() tag = 'none';

  data = [];
  id = null;
  selected = null;
  val = null;
  error = false;

  get value(): any {
    return this.val;
  }

  set value(newVal: any) {
    if (this.source) {
      this.Autofinder(newVal);
      this.val = newVal;
      this.onChangeCallback(newVal);
    } else {
      this.service$.asObservable().subscribe((data: any) => {
        if (data) {
          this.Autofinder(newVal);
          this.val = newVal;
          this.onChangeCallback(newVal);
        }
      });
    }
  }

  matcher = new MyErrorStateMatcher();

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  private onValidationChangeCallback: () => void = noop;

  constructor(@Optional() @Host() @SkipSelf() private controlContainer: ControlContainer,
    private service: HelperAutocompleteService) {
    // this.controlContainer.control.get(this.formControlName).disable();
    // this.data = this.source;
  }

  ngOnInit(): void {
    if (!this.source && this.uri) {
      this.service.getData(this.uri).subscribe((data: any) => {
        if (data) {
          this.source = data[this.object];
          this.data = this.source;
          this.service$.next(this.source);
        }
      });
    } else {
      this.service$.next(this.source);
    }

    this.service.OnReloadState().subscribe((tag: any) => {
      if (tag === this.tag && this.tag !== 'none') {
        this.service.getData(this.uri).subscribe((data: any) => {
          if (data) {
            this.source = data[this.object];
            this.data = this.source;
            this.service$.next(this.source);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.service$.unsubscribe();
  }

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onBlur() {
    this.onTouchedCallback();
  }

  display(item) {
    if (item != null) {
      this.value = item;
      return this.selected ? this.selected[this.keyDisplay] : '';
    } else {
      this.selected = null;
      return '';
    }
  }

  Autofilter(name: string) {
    if (this.source) {
      return this.source.filter((item: any) => {
        if (!item[this.keyValue]) {
          Object.assign(item, { [this.keyValue]: '' });
        }
        if (!item[this.keyDisplay]) {
          Object.assign(item, { [this.keyDisplay]: '' });
        }
        return (item[this.keyValue].toString().toLowerCase().indexOf(name.toString().toLowerCase()) !== -1) ||
          (item[this.keyDisplay].toString().toLowerCase().indexOf(name.toString().toLowerCase()) !== -1);
      }).map((list: any) => {
        if (list) {
          return list;
        } else {
          this.selected = null;
          return this.source;
        }
      });
    }
  }

  Autofinder(id: any) {
    const found = this.source.find((item: any) => {
      return item[this.keyValue] === id;
    });

    if (found) {
      this.selected = found;
      this.OnChangeValue.emit(found);
    } else {
      this.OnChangeValue.emit(null);
      this.selected = null;
    }
  }

  returnFirstElement(event) {
    if (this.data && !!this.data && !this.selected) {
      if (this.data[0]) {
        this.value = this.data[0].Id;
      }
    }
  }

  validate(c: AbstractControl): { [key: string]: any; } {
    const msn_req = 'Required';
    const msn_nfound = 'Option Not Found';
    if (c.touched && c.hasError('required') && !this.selected) {
      this.msnError = msn_req;
      return { noexist: true };
    } else if (c.touched && c.hasError('required')) {
      this.msnError = msn_req;
      return { noexist: true };
    } else if (!this.selected && c.touched && this.val) {
      this.msnError = msn_nfound;
      return { noexist: true };
    } else {
      this.msnError = '';
      return null;
    }
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChangeCallback = fn;
  }
}
