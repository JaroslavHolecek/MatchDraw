class NotSupportedAttributeValue extends Error{
    constructor(attr_name, attr_value, message = "", ...args) {
        super(message, ...args);
        this.name = "NotSupportedAttributeValue";
        this.message = message + ` Not support value ${attr_value} for ${attr_name}`;
    } 
}

class NotMatchArguments extends Error{
    constructor(attr1_name, attr1_value, attr2_name, attr2_value, message = "", ...args) {
        super(message, ...args);
        this.name = "NotMatchArguments";
        this.message = message + ` Atributes ${attr1_name} and ${attr2_name} do not match. Values: ${attr1_value} and ${attr2_value}`;
    } 
}

class NotOverridenFunction extends Error{
    constructor(function_name, base_class_name, message = "", ...args) {
        super(message, ...args);
        this.name = "NotOverridenFunction";
        this.message = message + ` Function ${function_name} from ${base_class_name} must be overriden - let it know to developer`;
    } 
}

class MissingProperty extends Error{
    constructor(property_name, usage_name, message = "", ...args) {
        super(message, ...args);
        this.name = "MissingProperty";
        this.message = message + ` Property ${property_name ? property_name : '<unspecified>'} missing for use in ${usage_name}`;
    } 
}

class InnerClassUnusable extends Error{
    constructor(innerClass_name, message = "", ...args) {
        super(message, ...args);
        this.name = "InnerClassUnusable";
        this.message = message + ` Cannot use ${innerClass_name} inside`;
    } 
}

class IncorrectValues extends Error{
    constructor(name, rule_description, message = "", ...args) {
        super(message, ...args);
        this.name = "IncorrectValues";
        this.message = message + ` In object ${name} violating: ${rule_description}`;
    } 
}

class UnexpectedCall extends Error{
    constructor(function_name, rule_description, message = "", ...args) {
        super(message, ...args);
        this.name = "UnexpectedCall";
        this.message = message + ` Unexpected call of ${function_name} violating: ${rule_description}`;
    } 
}

module.exports = {
    NotSupportedAttributeValue,
    NotMatchArguments,
    NotOverridenFunction,
    MissingProperty,
    InnerClassUnusable,
    IncorrectValues,
    UnexpectedCall
};