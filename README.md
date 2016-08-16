# Angular-c360
Angular services and directives for interacting with [Configurator 360](Configurator360.autodesk.com).

## Summary
By using the [c360Context](services/c360Context.service.js) service to load a Configurator 360 model (either a new model or a saved model), you are given a javascript object representing the root part from your model.  This object contains a property for each child part, a property for each model property, and a function for each action (e.g. downloading drawings).  Each of the child parts contains all of this functionality as well -- all the way down the hierarchy.  This allows you to interact with your entire C360 model on the client side using javascript.

## Demo
A live sample application can be found [here](https://d3automation.github.io/angular-c360-sample/).
The source code for this sample is in its [own repository](https://github.com/D3Automation/angular-c360-sample), along with instructions for running the sample locally. 

## Dependencies
* [Angular](https://angular.io/)
* [Breeze](http://breeze.github.io/doc-main/)

## Installation

* [Bower](https://github.com/bower/bower) 

    ``` 
    bower install 
    ```

## Common Usage
* Loading Model
    * In your desired controller, inject `c360Context`.
    * Run `c360Context.GetNewModel()` which returns a promise containing the root part.
    * Example:

    ```    
    function getModel(c360Context) {
        return c360Context.getNewModel()
            .then(function (root) {
                return root;
            })
            .catch(function () {
                alert('error');
            });
    }
    ```
* Using root part after loading Model 
    * Evaluating / Setting Properties
        * In your controller you can begin to expose the model to Angular.
        ```    
        function ModelController(rootPart) {
            var vm = this;
            vm.rootPart = rootPart;
            activate();
            function activate() {}
        }
        ```
        * In this example, you now have access to any ETO UIProperties that exist on the rootPart, which is exposed in angular as vm.RootPart.
        * To access properties or to set properties in the Angular controller, treat them as normal properties on objects. 
        * For example: `vm.rootPart.Foo` will return the object which is the UIProperty 'Foo' and `vm.rootPart.Foo.Value` will return the value of that property.
        * There are many more properties on the object created from the UIProperty, including choiceList, dataType, uiRuleName and more. For more, you can reference the [uiProperty.js](https://github.com/D3Automation/angular-c360/blob/master/common/uiProperty.js) file.
    
    * Executing Actions
        * Actions appear as functions on rootPart and all its children, all the way down the heirarchy, so they can be called just like calling any existing javascript function.   

* Binding properties to HTML Elements
    * ETO Properties can be bound to specific HTML elements using the provided `c360-prop` directive. This directive sets attributes on the HTML Element automatically to control `ng-model`, `ng-class`, `ng-disabled`, `tooltip` and `tooltip-popup-delay` all based on properties on the UIProp provided. The source can be seen [here](https://github.com/D3Automation/angular-c360/blob/master/directives/c360Prop.directive.js).
    * Example  :
    ```
    <input c360-prop="vm.rootPart.Foo"></input>
    ``` 
    Will expand to something similar to (formatted for readability): 
    ```
    <input 
        class="c360-prop ng-pristine ng-valid ng-scope md-input ng-touched"
        ng-model="vm.rootPart.Foo.value" 
        ng-class="{ 'c360-modified': vm.rootPart.Foo.isModified, 
            'c360-invalid': vm.rootPart.Foo.errorInfo }" ng-disabled="vm.rootPart.Foo.isReadOnly" 
        tooltip="" 
        tooltip-popup-delay="1000" 
        ng-model-options="{ updateOn: vm.rootPart.Foo.updateOn }" 
        type="text" 
        aria-disabled="false" 
        aria-invalid="false"
    >
    ```

*	Custom Directives 
    * Custom Directives can be used to parse through the provided uiProp and decide what kind of HTML Element to generate. 
    * An example of this can be found in the **angular-c360** Sample App [here](https://github.com/D3Automation/angular-c360-sample/blob/master/app/common/c360MdProp.html). 

*	Setting designKey
    * In **angular-c360**, the model is defined in the c360ContextProvider by setting the Design key. You can see an example in the sample app in the `\app\app.config.js\` file. 
    * To set the model to your own, retrieve the design Key from your Configurator 360 project and insert the string into the .setDesignKey() function. 
    * To get the design key for your own model first open your c360 model. The design key is the unique identifier for your design within C360 (i.e. all text to the right of the "https://configurator360.autodesk.com/" text in your C360 design URL). 

*	Graphics
    * Adding the graphics viewer is as simple as adding a viewer entity.
    
    ```
    <c360-viewer></c360-viewer>
    ```  
    
    * There is no interactibility with the actual viewer, it's just plug and play.

## Advanced Usage

With **angular-c360**, we have exposed and streamlined a set of functions we think should give you the control you need to do almost everything you should need in everyday usage. All of this functionality exists on the `c360Context` object. For anything else, you can directly retrieve the viewer object (`c360Context.getViewer()`) and you'll have complete access to the functionality provided by C360.

Documentation on viewer object provided by [C360](http://help.autodesk.com/view/CFG360/ENU/?guid=GUID-EB383FD3-A9D1-4231-B7E0-DC5DE64ADE12) 
*	Get Part By Refchain
    ```
    c360Context.getPartByRefChain('Root.Foo.Bar')
    ``` 
    * This returns the UIPart at the given refChain, in this case, the UIPart `Bar` which is a child of `Foo`

* 	Custom Model Adapter
    * The model adapter visits every UIPart created and makes modifications to streamline property creation, remove invalid characters, assemble collections of like parts and more. To edit this functionality, use the `setModelAdapter()` function.
    * An example custom adapter, which would change how invalid characters are replaced would look like this:

    ```
    customAdapter = {
        invalidCharacterReplacement = 'x',
    }
    setModelAdapter(customAdapter);
    ```
    * This would replace all invalid characters with 'x' instead of the default empty string.
    * For the default model adapter, you can reference [c360Context.service.js](https://github.com/D3Automation/angular-c360/blob/master/services/c360Context.service.js).

## API

[Click here.](README_API.md)