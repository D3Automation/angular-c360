# angular-c360
Angular services and directives for interacting with [Configurator 360](https://configurator360.autodesk.com).

## Summary
By using the [c360Context](services/c360Context.service.js) service to load a Configurator 360 model (either a new model or a saved model), you are given a javascript object representing the root part from your model.  This object contains a property for each child part, a property for each model property, and a function for each action (e.g. downloading drawings).  Each of the child parts contains all of this functionality as well -- all the way down the hierarchy.  This allows you to interact with your entire C360 model on the client side using javascript.

Once the C360 model has been retrieved, the client-side model is automatically kept in sync with the server-side model. When a UIProperty is updated on the client, the change
is automatically sent to the server, and any resultant changes (dependent properties, addition/removal of children, etc.) are returned and incorporated into the client-side model.  

## Table of Contents
* [Demo](#demo)
* [Dependencies](#dependencies)
* [Installation](#installation)
* [Common Usage](#common-usage)
* [Advanced Usage](#advanced-usage)
* [Inspecting Client-Side Model](#inspecting-client-side-model)
* [C360 Errors](#c360-errors)
* [Versioning](#versioning)
* [Authors](#authors)
* [License](#license)
* [API](API.md)

## Demo
A live sample application can be found [here](https://d3automation.github.io/angular-c360-sample/).
The source code for this sample is in its [own repository](https://github.com/D3Automation/angular-c360-sample), along with instructions for running the sample locally. 

## Dependencies
* [Angular](https://angularjs.org/)
* [BreezeJS](http://breeze.github.io/doc-js/)

## Installation

### [Bower](https://bower.io/) 

#### Install Bower package
``` 
bower install angular-c360 --save
```

#### Add scripts and CSS to index.html (for both angular-c360 and its dependencies)
_Note: Assumes that the scripts for Angular iteslf have already been added above_
```html
<!-- angular-c360 and its dependencies -->
<link rel="stylesheet" href="bower_components/angular-c360/angular-c360.css" />
<script src="bower_components/breeze-client/build/breeze.min.js"></script>
<script src="bower_components/breeze-client/build/adapters/breeze.bridge.angular.js"></script>
<script src="bower_components/angular-c360/angular-c360.min.js"></script>

<!-- C360 scripts from Autodesk -->
<script src="https://configurator360.autodesk.com/Script/v1/EmbeddedViewer"></script>
```

#### Register angular-c360 module in your application
```javascript
angular.module('app', ['angular-c360']);
```

#### Set design key
In order for angular-c360 to know which design to use, we have to set the design key on c360ContextProvider when our application starts up.  The design key is the unique identifier for your design within C360 (i.e. all text to the right of the "https://configurator360.autodesk.com/" text in your C360 design URL).  The best place to set the design key is within a [configuration block](https://docs.angularjs.org/guide/module):
```javascript
var app = angular.module('app');

app.config(['c360ContextProvider', function (c360ContextProvider) {
    // To use your own design, change the design key being passed below
    c360ContextProvider.setDesignKey('575458448649916390/2gn1dj1tslb4');
}]);
```

## Common Usage
_Note: Code samples shown below adhere to the [Angular 1 Style Guide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md) from John Papa._

### Loading Model
* In your desired controller, inject `c360Context`.
* Run `c360Context.getNewModel()` which returns a promise containing the root part.

Example:
```javascript
(function () {
    'use strict';

    angular.module('app')
        .controller('MyController', MyController);

    MyController.$inject = ['c360Context'];

    function MyController(c360Context) {
        var vm = this;

        vm.rootPart = undefined;

        activate();

        function activate() {
            c360Context.getNewModel()
                .then(function (root) {
                    vm.rootPart = root;
                })
                .catch(function (error) {
                    alert('Error': error);
                });
        }
    }
})();        
```

Note that there are various ways of identifying dependencies that are being injected into your controller (e.g. `c360Context` above).  See
[this section in John Papa's Angular 1 Style Guide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#manual-annotating-for-dependency-injection) for
additional details.

See the [C360 Errors](#c360-errors) section below for details on error handling.

### Creating Inputs for Properties
#### Basic Usage
Adding an input for a C360 property can easily be done using the [`c360-prop`](directives/c360Prop.directive.js) directive. The standard template for this directive includes logic to dynamically create
a text `input`, checkbox `input`, or `select` based on the metadata associated with the property.  All it requires is a reference to the property object:
```html
<c360-prop ui-prop="vm.rootPart.MyProperty"></c360-prop>
```

#### Overriding Label
It is possible to override the label text used for the input using the `label-text` attribute:
```html
<c360-prop ui-prop="vm.rootPart.MyProperty" label-text="My Custom Label"></c360-prop>
```

#### Styling
The [standard template](directives/c360Prop.html) can be styled by targeting the `c360-prop` tag as well as the `c360-modified` and `c360-invalid` CSS classes.  If additional customization is needed,
it is also possible to completely override the template by specifying the URL of another template using the `c360PropTemplateUrl` constant.  For example:
```javascript
var app = angular.module('app');
app.constant('c360PropTemplateUrl', 'app/common/c360MdProp.html');
```

An working example of the custom template shown above can be found [here](https://github.com/D3Automation/angular-c360-sample/blob/master/app/common/c360MdProp.html).

For even further customization, it is also possible to build your own [custom directive](https://docs.angularjs.org/guide/directive).  Using the [`c360-prop`](directives/c360Prop.directive.js) directive
as your guide, it is relatively simple to creating bindings to the various properties of each C360 property object.

### Executing Actions (e.g. downloading drawings)
As mentioned above, all actions defined on a given part in your C360 model are available in the client-side model as functions on that part.  Executing an action is as simple as calling one of those functions.  The simplest way to do this is through an [`ng-click`](https://docs.angularjs.org/api/ng/directive/ngClick) binding:

```html
<button ng-click="vm.rootPart.CreateDrawingDWG()">Download DWG</button>
```

### Graphics
Adding the graphics viewer is as simple as adding a viewer element:
    
```html
<c360-viewer></c360-viewer>
```  
    
There is no interactibility with the actual viewer, it's just plug and play.

## Advanced Usage
### Get Part By Refchain
```
c360Context.getPartByRefChain('Root.Foo.Bar')
``` 

This returns the UIPart at the given refChain, in this case, the UIPart `Bar` which is a child of `Foo`

### Interacting With Model in Javascript
Once you have a reference to a part within your controller (see above for how to get root part and/or get a specific part by Refchain), you can evaluate/set properties and execute actions on parts anywhere in the model hierarchy.

#### Evaluating / Setting Properties

Assuming you already have a variable named `rootPart` that references the root part of your model, the following code will evaluate (and potentially set) a property on a child part:
```javascript   
if (rootPart.SomeChild.SomeGrandchild.PartNumber.value !== null) {
    alert('The part number is ' + rootPart.SomeChild.SomeGrandchild.PartNumber.value);
} else {
    rootPart.SomeChild.SomeGrandchild.PartNumber.value = 'PT-15';
}
```

In the above example, the code sets the PartNumber property if it is not already set.  However, since this is an asynchronous call to the server (which returns a promise), any code after the property is set will execute immediately rather than waiting on the update to finish.  In order to add code after the asynchronous call, the following approach can be used:

```javascript
c360Context.updateProperty('Root.SomeChild.SomeGrandchild', 'uiPartNumber', 'PT-15')
    .then(function() {
        alert('The PartNumber property was successfully set');
    })
    .error(function() {
        alert('An error occurred while setting the PartNumber property');
    });
```

#### Evalating other attributes of the C360 property object 
There are many more properties on the object created from the UIProperty, including choiceList, dataType, uiRuleName and more. For more, you can reference the [uiProperty.js](https://github.com/D3Automation/angular-c360/blob/master/common/uiProperty.js) file.    

#### Executing Actions
Actions appear as functions on rootPart and all its children, all the way down the hierarchy, so they can be called just like calling any existing javascript function.

Here is an example of executing an action within a controller:
```javascript
(function () {
    'use strict';

    angular.module('app')
        .controller('MyController', MyController);

    MyController.$inject = ['c360Context'];

    function MyController(c360Context) {
        var vm = this;

        vm.rootPart = undefined;
        vm.downloadDrawings = downloadDrawings;

        activate();

        function activate() {
            c360Context.getNewModel()
                .then(function (root) {
                    return root;
                })
                .catch(function (error) {
                    alert('Error': error);
                });
        }

        function downloadDrawings() {
            // Add some other logic here before calling the action, if needed
                                 
            vm.rootPart.CreateDrawingDWG()
                .then(function() {
                    // The action returns a promise, so put any logic here
                    //  that you would like to execute after the action completes
                });
        }
    }
})();        
```
      
Note that there are various ways of identifying dependencies that are being injected into your controller (e.g. `c360Context` above).  See
[this section in John Papa's Angular 1 Style Guide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#manual-annotating-for-dependency-injection) for
additional details.

See the [C360 Errors](#c360-errors) section below for details on error handling.

### Custom Model Adapter
When the client-side model is updated after each call to the server, we have the ability to affect how the model is created by using a model adapter object.  The default model adapter can be found in [c360Context.service.js](https://github.com/D3Automation/angular-c360/blob/master/services/c360Context.service.js).

By creating a custom model adapter, we can override the logic used for the following:
* **Replacing invalid characters in property names**
    * The base name for a property in a C360 model can contain characters that are not valid in property names in javascript
    * For example, a property in C360 might be named "Scrap %".  Neither the space nor the % can be used in a javascript property name, so they need to be replaced when the client-side model is created.
    * By default, an empty string will be used as the replacement
* **Executing custom javascript for every part that is returned from the server**
    * One example would be to log some information about each part
    * Another example is to actually modify some of the parts in some way in order to facilitate some special logic in the UI

Here is an example of a custom model adapter that overrides both pieces of functionality (however, one could be created that only overrides one or the other):
```javascript
var customAdapter = {
    visitPart: function(part) {
        // Log the part's refChain
        console.log(part.refChain);

        // Add a special property that we'll use in some UI logic
        if (part.partType === 'Foo') {
            part.templateUrl = 'app/foo/foo.html';
        } else {
            part.templateUrl = 'app/common/bar.html';
        }
    },
    invalidCharacterReplacement = '_',
};

var app = angular.module('app');
app.run(function(c360Context)  {
    c360Context.setModelAdapter(customAdapter);
});

```

### Accessing the C360 viewer object directly
With **angular-c360**, we have exposed and streamlined a set of functions we think should give you the ability to do almost everything needed in typical usage scenarios. All of this functionality exists on the `c360Context` service. For anything else, you can directly retrieve the viewer object (`c360Context.getViewer()`), and you'll have complete access to the functionality provided by C360.

[Autodesk documentation for C360 Viewer](http://help.autodesk.com/view/CFG360/ENU/?guid=GUID-82310904-D89F-46B6-A1D2-8E5F07333DA3) 

## Inspecting Client-Side Model
Once the client-side model has been created by `c360Context`, it is pretty handy to be able to inspect the model object.  This makes it easier to see what properties, children, and actions are available on each part without having to refer back to the C360 designs.  The simplest way to do this is from the console window in your browser's developer tools (F12).  You can evaluate the following statement to simultaneously get a reference to the c360Context service and ask it for a reference to the root part:

```javascript
angular.element(document.body).injector().get('c360Context').getRoot()
```

## C360 Errors
### Resolving Error Name From Error Code
If an error occurs while loading the model, the error code will be passed in to the `catch` method of the promise.  The error code can then be
compared to the [`ADSK.C360.loadedState`](http://help.autodesk.com/view/CFG360/ENU/?guid=GUID-1A1B61D7-0453-4B76-B0D2-E9D2F3107036) enumeration to
determine the type of error.

### Common Errors
#### ADSK.C360.loadedState.Forbidden (403)
This error occurs when the URL for your site has not been added under the  **_Allow these authorized sites to embed configuration pages of my designs_** page under Options/Embedding for the C360 account
that owns the design your application is configured to use.

This will **_always_** occur if you are using **_localhost_** in your URL.  If your application is running on your local machine, you will
need to use **http://127.0.0.1** rather than http://localhost.  You will also still need to add http://127.0.0.1 as an authorized site. 

#### ADSK.C360.loadedState.DesignOpenInOtherWindowOrTab (12)
This error occurs when you attempt to load a C360 design in a browser tab while you already have the same design opened in another tab of the same
browser.  Due to the way C360 handles sessions, using a different browser altogether is the only way to use multiple instances of the same design
simultaneously.

## Versioning
We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/D3Automation/angular-c360/tags). 

## Authors
* [D3 Automation](http://d3tech.net/solutions/automation/)

See also the list of [contributors](https://github.com/D3Automation/angular-c360/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
