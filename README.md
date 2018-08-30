# Autocomplete

## Usage
All files are within SharedModule, copy it to your project
Import SharedModule in your app module
Use it on your components
<ngx-autocomplete
    [keyValue]: string representing the value returned from the component ( @HTML = <option value='[keyValue]'> ) 
    [keyDisplay]: string representing the  displayed text ( @HTML = <option value='[keyValue]'>[keyValue] - [keyDisplay]</option> )
    [placeholder]: string used when there is nothing selected
    [formControl]: Form Group Control
    [uri]: string URL to fetch data from
    [jobjects]: string JSON key used to get the data fetched from the URL
    [source]: array Local data to be displayed
>
</ngx-autocomplete>

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
