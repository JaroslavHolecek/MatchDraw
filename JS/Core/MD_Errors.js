class NotSupportedAttributeValue extends Error{
    constructor(attr_name, attr_value, message = "", ...args) {
        super(message, ...args);
        this.message = message + `not support value ${attr_value} for ${attr_name}`;
    } 
}

module.exports = {NotSupportedAttributeValue};