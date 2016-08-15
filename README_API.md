c360Context - Brief summary of each function

* `endSession()`
    * Purpose
        * Closes the current model and ends C360 Session  

* `executeAction(actionParams)`
    *	Purpose
        * Executes actions on a given part. e.g. Process quote documents on assembly. 
        * n.b: This should not be necessary to run manually as actions are automatically 
        created as invokable functions on UIParts which contain actions.
    *	Inputs
        * Settings Object: 
            * String: refChain (of part)
            * String: Name (of action)  
            * Settings object: Params (for action)
    *	Return  
        * Logs action information, returns message of failure of action, no return on success.
     

* `getLastError()`
    *	Purpose
        * Displays most recent error again.
    *	Return    
        * Returns most recent reason for error.    

* `getNewModel()`
    *	Purpose 
        * Initializes an empty model

* `getParts()`
    *	Purpose
        * Returns all parts in the initialized model
    *	Return 
        * List of all UI Parts 

* `getPartByRefChain(refChain)`
    *	Purpose
        * Returns the UIPart at the given refchain. 
    *	Inputs
        * String: refChain - e.g. 'Root.Foo.Bar' 
    *	Return 
        * Above example returns the UIPart Bar, a child of Foo.
        
* `getRoot()`
    *	Purpose
        * Returns the root UIPart
    *	Return 
        * Root UIPart

* `getViewer()`
    *	Purpose
        * Returns the viewer object
    *	Return 
        * Viewer object

* `isDirty()`
    *	Purpose
        * Returns whether the model has been updated since its open or save 
    *	Return
        * Boolean 

* `isModelLoaded()`
    *	Purpose
        * Checks if there is a model loaded
    *	Return                       
        * Boolean

* `loadModel(modelBlob)`
    *	Purpose
        * Loads a model into a new or existing viewer
        * From [C360 Documentation](http://help.autodesk.com/view/CFG360/ENU/?guid=GUID-EB383FD3-A9D1-4231-B7E0-DC5DE64ADE12) - Contents of an .ikms file (generated from the Configurator 360 save operation) to load into the viewer. Save the session from the same design you are opening or the session is ignored. This is typically obtained from an `<input type="file">` element or from an XMLHttpRequest with responseType = 'blob' . 
    *	Inputs
        * Blob: The desired object to open

* `resetProperty(refChain, Name)`
    *	Purpose
        * Resets a property to its default value
    *	Inputs
        * String: refchain of the UIPart
        * String: name of the UIProperty
* `setDirty(boolean)`
    *	Purpose
        * Flags the model as dirty or clean, used for showing the model has pending, unsaved changes
    *	Inputs
        * Boolean: true for dirty, false  for clean

* `setModelAdapter(adapter)`
    *	Purpose
        * Updates the model adapter which visits every UIPart and sets/creates properties as necessary
    *	Inputs
        * Configuration object  
            * String: InvalidCharacterReplacement
            * Function: VisitPart
            * Function/Boolean: IsPartCollection
            * Funtion: ParseCollectionName

* `updateProperty(refChain, name, value)`
    *	Purpose
        * Updates a UIProperty with the provided value
    *	Inputs
        * String: refchain of the desired UIPart
        * String: name of the desired UIProperty on the UIPart
        * Any: value to set the value of the provided property

* `updateProperties(properties)`
    *	Purpose 
        * Updates a set of properties, using paramters deliniated in the C360 documentation
    *	Inputs
        * Any: Properties list. See [C360 Documentation](http://help.autodesk.com/view/CFG360/ENU/?guid=GUID-82310904-D89F-46B6-A1D2-8E5F07333DA3) for more information.