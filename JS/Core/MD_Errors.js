class NotSupportedAttributeValue extends Error{
    constructor(attr_name, attr_value, message = "", ...args) {
        super(message, ...args);
        this.name = "NotSupportedAttributeValue";
        this.message = message + `not support value ${attr_value} for ${attr_name}`;
    } 
}

class NotMatchArguments extends Error{
    constructor(attr1_name, attr1_value, attr2_name, attr2_value, message = "", ...args) {
        super(message, ...args);
        this.name = "NotMatchArguments";
        this.message = message + `Atributes ${attr1_name} and ${attr2_name} do not match. Values: ${attr1_value} and ${attr2_value}`;
    } 
}

class NotOverridenFunction extends Error{
    constructor(function_name, base_class_name, message = "", ...args) {
        super(message, ...args);
        this.name = "NotOverridenFunction";
        this.message = message + `Function ${function_name} from ${base_class_name} must be overriden - let it know to developer`;
    } 
}

module.exports = {
    NotSupportedAttributeValue,
    NotMatchArguments,
    NotOverridenFunction
};