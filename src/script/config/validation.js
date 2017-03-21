angular.module('app').config(['$validationProvider',function ($validationProvider) {
    var expression = {
        phone: /^1[\d]{10}/,
        password: function (value) {
            var str = value+ '';
            return str.length >5;
        },
        required: function (value) {
            return !!value;
        }
    };
    var defaultMsg = {
        phone: {
            success: '',
            error: '必须是11位手机号'
        },
        password: {
            success: '',
            error: '长度至少6位'
        },
        required: {
            success: '',
            error: "不能为空"
        }
    };
    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}]);

//修改angular的内置服务 $http
angular.module('app').config(['$provide',function ($provide) {
    $provide.decorator('$http',['$delegate','$q',function ($delegate,$q) {
        var get = $delegate.get;
        $delegate.post = function (url,data,config) {
            var def = $q.defer()
            get(url).success(function (resp) {
                def.resolve(resp);
            }).error(function (err) {
                def.reject(err);
            })
            return {
                success:function (cb) {
                    def.promise.then(cb);
                },
                error: function (cb) {
                    def.promise.then(null,cb);
                }
            }
        }
        return $delegate;
    }]);
}]);

//cache服务 用于缓存信息
angular.module('app').service('cache', ['$cookies', function($cookies){
    this.put = function(key, value){
        $cookies.put(key, value);
    };
    this.get = function(key) {
        return $cookies.get(key);
    };
    this.remove = function(key) {
        $cookies.remove(key);
    };
}]);

