function Util() {
    this.isInteger = function (para){
        return para>=0 && typeof para === 'number' && para%1 === 0; //是整数，则返回true，否则返回false
    }
};
module.exports = Util;