module.exports = function(property, req, modelData) {
    try {
        if(typeof property === "undefined") {
            return "";
        }
        if(typeof req.param(property) !== "undefined") {
            return req.param(property);
        }
        if(typeof modelData !== "undefined" 
            && typeof modelData[property] !== "undefined") {
            return CommonUtils.NVL(modelData[property]);
        }

        return "";
    } catch(e) {
        console.log(e.message);
        return "";
    }
}