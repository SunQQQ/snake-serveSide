function Util() {
    // 判断是否是大于等于0的正整数
    this.isInteger = function (para) {
        return para >= 0 && typeof para === 'number' && para % 1 === 0; //是整数，则返回true，否则返回false
    };
    // 判断是否包含script、style、<xxx>等标签
    this.isXss = function (strings) {
        var script = strings.indexOf('script'),
            style = strings.indexOf('style'),
            tags = /<.*>/.test(strings);
        if(script==-1 && style==-1 && !tags){
            return true;
        }else {
            return false;
        }
    }
};
module.exports = Util;