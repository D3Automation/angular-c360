function UIProperty(c360Context, hostPart, adeskProp) {
    this.c360Context = c360Context;
    this.hostPart = hostPart;
    this.adeskProp = adeskProp;
    this.parseChoiceList();
    this.parseTooltip();
}
Object.defineProperty(UIProperty.prototype, "category", {
    get: function () {
        return this.adeskProp.Category;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "choiceList", {
    get: function () {
        return this.choiceListData;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "choiceListDisplayMode", {
    get: function () {
        return this.adeskProp.ChoiceListDisplayMode;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "customData", {
    get: function () {
        return this.customDataValue;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "dataType", {
    get: function () {
        return this.dataTypeValue;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "errorInfo", {
    get: function () {
        return this.adeskProp.ErrorInfo;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "fullName", {
    get: function () {
        return this.adeskProp.FullName;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "inputType", {
    get: function () {
        if (this.dataType === 'Date') {
            return 'date';
        }
        else if (this.dataType === 'Boolean') {
            return 'checkbox';
        }
        else if (this.dataType === 'Integer' || this.dataType === 'Number') {
            return 'number';
        }
        else {
            return 'text';
        }
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "invParamName", {
    get: function () {
        return this.adeskProp.InvParamName;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "isCheckbox", {
    get: function () {
        return (this.dataType === 'Boolean');
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "isLocked", {
    get: function () {
        return this.adeskProp.IsLocked;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "isModified", {
    get: function () {
        return this.adeskProp.IsModified;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "isReadOnly", {
    get: function () {
        return this.adeskProp.IsReadOnly;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "part", {
    get: function () {
        return this.hostPart;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "precision", {
    get: function () {
        return this.adeskProp.Precision;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "restrictToList", {
    get: function () {
        return this.adeskProp.RestrictToList;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "sequence", {
    get: function () {
        return this.adeskProp.Sequence;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "tooltip", {
    get: function () {
        return this.adeskProp.Tooltip;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "uiRuleName", {
    get: function () {
        return this.adeskProp.UiRuleName;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "updateOn", {
    get: function () {
        if (this.isCheckbox || this.hasChoiceList) {
            return 'default';
        }
        else {
            return 'blur';
        }
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "value", {
    get: function () {
        return this.adeskProp.Value;
    },
    set: function (newValue) {
        this.adeskProp.Value = newValue;
        this.c360Context.updateProperty(this.part.refChain, this.uiRuleName, newValue);
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(UIProperty.prototype, "hasChoiceList", {
    get: function () {
        return this.choiceList && this.choiceList.length > 0;
    },
    enumerable: true,
    configurable: true
});
UIProperty.prototype.reset = function () {
    this.c360Context.resetProperty(this.part.refChain, this.uiRuleName);
};
UIProperty.prototype.parseChoiceList = function () {
    if (this.adeskProp.ChoiceList) {
        this.choiceListData = this.adeskProp.ChoiceList.map(function (choice) {
            return { value: choice.DisplayString, text: choice.DisplayString };
        });
    }
};
UIProperty.prototype.parseTooltip = function () {
    try {
        var toolTipObject = JSON.parse(this.adeskProp.Tooltip);
        this.toolTipValue = toolTipObject.ToolTip;
        this.dataTypeValue = toolTipObject.DataType;
        this.customDataValue = toolTipObject.CustomData;
    }
    catch (e) {
        this.dataTypeValue = this.getDataTypeFromValue();
    }
};
UIProperty.prototype.getDataTypeFromValue = function () {
    return 'String';
};