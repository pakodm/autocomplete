import {
  Component, OnInit, Input, ViewContainerRef, ViewChild,
  OnDestroy, forwardRef, Optional, Host, SkipSelf, Injector, ContentChild,
  TemplateRef, Output, EventEmitter, AfterViewInit, ElementRef, ChangeDetectorRef
} from '@angular/core';
import {
  FormControl, FormBuilder, FormGroup, ControlValueAccessor, Validator,
  NG_VALUE_ACCESSOR, FormGroupDirective, NgForm, AbstractControl,
  NG_VALIDATORS, ControlContainer, Validators, NgControl
} from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorStateMatcher } from '@angular/material/core/typings/error/error-options';
import {
  HELPER_AUTOCOMPLETE_VALUE_ACCESOR,
  HELPER_AUTOCOMPLETE_VALIDATORS
} from '../helper-autocomplete/helper-autocomplete.component';
import { NgxAutocompleteService } from './ngx-autocomplete.service';
import { MatInput } from '../../../../../node_modules/@angular/material';

export const NGX_AUTOCOMPLETE_VALUE_ACCESOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line:no-use-before-declare
  useExisting: forwardRef(() => NgxAutocompleteComponent),
  multi: true
};

export const NGX_AUTOCOMPLETE_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  // tslint:disable-next-line:no-use-before-declare
  useExisting: forwardRef(() => NgxAutocompleteComponent),
  multi: true,
};

const noop = () => {
};

export class MyErrorStateMatcher implements ErrorStateMatcher {
    constructor(private formControl: FormControl) {
  }
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    // return !!(control && control.invalid && (control.dirty || control.touched));
    const isSubmitted = form && form.submitted;
    return !!(this.formControl && this.formControl.invalid
      && (this.formControl.touched || isSubmitted));
  }
}

@Component({
  selector: 'ngx-autocomplete',
  templateUrl: './ngx-autocomplete.component.html',
  styleUrls: ['./ngx-autocomplete.component.scss'],
  providers: [NGX_AUTOCOMPLETE_VALUE_ACCESOR, NGX_AUTOCOMPLETE_VALIDATORS,
    NgxAutocompleteService
  ],
})
export class NgxAutocompleteComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy, AfterViewInit {

  InputControl: FormControl;
  OutputControl: FormControl;

  matcher: any;

  @ContentChild(TemplateRef) templ;
  // @ViewChild('AutoInput', {read: ElementRef}) InputView: MatInput;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  private onValidatorAgain: () => void = noop;

  filteredItems: Observable<any[]>;

  private source$ = new BehaviorSubject([]);
  private itemSelected$ = new BehaviorSubject(null);
  private value: any;
  private isDisabled = false;
  public isLoadingData = false;

  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() placeholder: string;
  @Input() keyValue: any;
  @Input() keyDisplay: any;
  @Input() uri: any;
  @Input() jobjects = [];
  @Input() reloader = false;
  @Input() OutputObject = false;
  @Input()
  set source(array) {
    this.source$.next(array);
  }
  get source() {
    return this.source$.getValue();
  }
  set ItemSelected(item) {
    this.itemSelected$.next(item);
    this.InputControl.setValue(this.InputDisplay);
  }
  get ItemSelected() {
    return this.itemSelected$.getValue();
  }
  set OutputValue(value) {
    if (value && this.source.length > 0) {
      this.ItemSelected = this.findItem(value);
    } else if (!value && this.source) {
      this.ItemSelected = null;
    } else {
      this.value = value;
    }
  }
  get InputDisplay() {
    const value = this.itemSelected$.getValue();
    if (value && value.hasOwnProperty(this.keyDisplay)) {
      return value[this.keyDisplay];
    } else {
      // error objeto json no tiene propiedad keyValue solicitada;
      return null;
    }
  }
  set IsDisabledState(state: boolean) {
    this.isDisabled = state;
    if (this.isDisabled) {
      this.InputControl.disable();
    } else {
      this.InputControl.enable();
    }
  }
  get IsDisabledState() {
    return this.isDisabled;
  }

  constructor(
    private injector: Injector,
    private cdRef: ChangeDetectorRef,
    @Optional() @Host() @SkipSelf() private controlContainer: ControlContainer,
    private npAutocompleteService: NgxAutocompleteService
  ) {
    console.log(this.source);
    this.InputControl = new FormControl(null);
    this.filteredItems = this.InputControl.valueChanges
      .pipe(
        startWith(''),
        map(value => value ? this.filterItems(value) : this.source ? this.source.slice() : [])
      );
  }

  filterItems(name: string) {
    return !this.source ? [] : this.source.filter((item) => {
      return (item[this.keyValue].toString().toLowerCase().indexOf(name.toString().toLowerCase()) !== -1) ||
        (item[this.keyDisplay].toString().toLowerCase().indexOf(name.toString().toLowerCase()) !== -1);
    });
  }

  findItem(id) {
    const find = this.source.find((item) => item[this.keyValue] === id);
    return find;
  }

  ngOnInit() {
    if (this.uri && this.jobjects.length > 0) {
      this.isLoadingData = true;
      this.npAutocompleteService.getData(this.uri).subscribe((data) => {
        let processedItems = 0;
        let response;
        for (const item of this.jobjects) {
          if (data && data.hasOwnProperty(item)) {
            response = data[item];
            processedItems++;
            if (processedItems === this.jobjects.length) {
              this.source$.next(response);
              this.isLoadingData = false;
            }
          } else {
            // error;
          }
        }
      }, (error) => { this.isLoadingData = false; });

    }
    // this.InputControl.setValidators(this.controlContainer.control.validator);
    this.source$.subscribe((source) => {
      if (this.source && this.source.length > 0) {
        this.ItemSelected = this.findItem(this.value);
      }
    });
    this.itemSelected$.subscribe((value) => {
      if (this.OutputObject) {
        this.onChangeCallback(value);
        this.selectionChange.emit(value);
      } else if (value && value.hasOwnProperty(this.keyValue)) {
        this.onChangeCallback(value[this.keyValue]);
        this.selectionChange.emit(value);
      } else {
        this.onChangeCallback(null);
        this.selectionChange.emit(null);
      }
    });
    this.filteredItems.subscribe((data: Array<any>) => {
      if (data.length <= 0) {
        this.itemSelected$.next(null);
      }
    });
    this.InputControl.valueChanges.subscribe((value) => {
      this.valueChange.emit(value);
      if (!this.ItemSelected) {
        this.onChangeCallback(value);
      }
      if (!value) {
        this.itemSelected$.next(null);
        this.onChangeCallback(null);
      }
    });
  }

  ngAfterViewInit(): void {
    // const ngControl: NgControl = this.injector.get(NgControl, null);
    this.OutputControl = this.injector.get(NgControl, null);
    if (this.OutputControl) {
      this.matcher = new MyErrorStateMatcher(this.OutputControl);
      this.cdRef.detectChanges();
    } else {
      console.log('no-control');
    }
  }
  ngOnDestroy(): void {
  }

  selectionChanged(value) {
    this.ItemSelected = value;
  }

  onBlur() {
    this.onTouchedCallback();
  }

  /*CONTROL_VALUE_ACCESOR*/
  writeValue(obj: any): void {
    this.OutputValue = obj;
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.IsDisabledState = isDisabled;
  }

  /*VALIDATORS*/
  validate(c: AbstractControl): { [key: string]: any; } {
    if (this.InputControl.value && !this.ItemSelected) {
      return { invalidSelection: true };
    } else {
      return null;
    }
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorAgain = fn;
  }
}
