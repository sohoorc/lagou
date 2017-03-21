angular.module('app').controller('mainCtrl',["$scope","$http",function ($scope,$http) {
    $http.get('data/positionList.json').success(function (resp) { //angular.js 在升级之后停止使用了success方法，改而使用then方法
        $scope.list = resp;
    });

}]);

angular.module('app').controller('positionCtrl',['$log','cache','$scope','$http','$state','$q',function ($log,cache,$scope,$http,$state,$q) {
    $scope.isLogin = !!cache.get('name');
    $scope.message = $scope.isLogin?'投个简历':'去登录';
    function getPosition() { //解决回调地域
        var def = $q.defer();

    $http.get('data/position.json?id='+$state.params.id).success(function (resp) {
        $scope.position = resp;
        if(resp.posted){
            $scope.message = '已投递';
        }
        def.resolve(resp);
    }).error(function (err) {
        def.reject(err);
    });
        return def.promise;
    }
    function getCompany(id) {
        $http.get('data/company.json?id='+id).success(function (resp) {
            $scope.company = resp;
        });
    }
    getPosition().then(function (obj) {
        getCompany(obj.companyId);
    });
    $scope.go = function () {
        if($scope.message !== "已投递") {
            if ($scope.isLogin) {
                $http.post('data/handle.json', {
                    id: $scope.position.id
                }).success(function (resp) {
                    $log.info(resp);
                    $scope.message = '已投递'
                })
            } else {
                $state.go('login')
            }
        }
    }
}]);

angular.module('app').controller('companyCtrl',['$scope','$http','$state',function ($scope,$http,$state) {
    $http.get('data/company.json?id='+$state.params.id).success(function (resp) {
        $scope.company = resp;
    });

}]);

angular.module('app').controller('searchCtrl',['$scope','$http','dict',function ($scope,$http,dict) {
    $scope.name = '';
    $scope.search = function () {
        $http.get('data/positionList.json?name='+$scope.name).success(function (resp) {
            $scope.positionList = resp;
        });
    };
    $scope.search();
    $scope.sheet = {};
    $scope.tabList = [{
        id: 'city',
        name: '城市'
    },{
        id:'salary',
        name:'薪水'
    },{
        id:'scale',
        name:'公司规模'
    }];
    $scope.filterObj = {};
    var tabId = '';
    $scope.tClick = function (id,name) {
        tabId = id;
        $scope.sheet.list = dict[id];
        $scope.sheet.visible = true;
    };
    $scope.sClick = function (id,name) {
        if(id) {
            angular.forEach($scope.tabList,function (item) {
                if(item.id ===tabId){
                   item.name = name;
                }
            });
            $scope.filterObj[tabId+'Id'] = id;
        }else {
            delete $scope.filterObj[tabId+'Id'];
            angular.forEach($scope.tabList,function (item) {
                if(item.id === tabId){
                    switch (item.id) {
                        case 'city':
                            item.name = '城市';
                            break;
                        case 'salary':
                            item.name = '薪水';
                            break;
                        case 'scale':
                            item.name = '公司规模';
                            break;
                        default:
                    }
                }
            })

        }
    }

}]);

angular.module('app').controller('sheetCtrl',['$scope','$http','$state',function ($scope,$http) {
    $http.get('data/positionList.json').success(function (resp) {
        $scope.positionList = resp;

    })
}]);

//个人页面
angular.module('app').controller('loginCtrl',['$state','cache','$scope','$http',function ($state,cache,$scope,$http) {

    $scope.submit = function () {
        $http.post('data/login.json',$scope.user).success(function (resp) {
            cache.put('id',resp.id);
            cache.put('name',resp.name);
            cache.put('image',resp.image);
            $state.go('main');
        })
    }
}]);

angular.module('app').controller('registerCtrl',['$scope','$http','$interval','$state',function ($scope,$http,$interval,$state) {
    $scope.submit = function () {
        $http.post('data/regist.json',$scope.user).success(function (resp) {
            $state.go('login')
        })
    }
    var count = 60;
    $scope.send = function () {
        $http.get('data/code.json').success(function (resp) {
            if(1===resp.state){
                count = 60;
                $scope.time = '60s';
                var interval = $interval(function () {
                    if(count<=0){
                        $interval.cancel(interval);
                        $scope.time = '';
                        return;
                    }else {
                        count --;
                        $scope.time = count + 's';
                    }
                },1000)
            }
        })
    }
}]);

angular.module('app').controller('meCtrl',['cache','$scope','$http','$state',function (cache,$scope,$http,$state) {
    if(cache.get('name')){
        $scope.name = cache.get('name');
        $scope.image = cache.get('image');
    }
    $scope.logout = function () {
        cache.remove('id');
        cache.remove('name');
        cache.remove('image');
        $state.go('main')
    }
}]);

angular.module('app').controller('favoriteCtrl',['$scope','$http',function ($scope,$http) {
    $http.get('data/myFavorite.json').success(function (resp) {
        $scope.list = resp;
    })
}]);

angular.module('app').controller('postCtrl',['$scope','$http',function ($scope,$http) {
    $scope.tabList=[{
        id:'all',
        name: '全部'
    },{
        id:'pass',
        name: '面试邀请'
    },{
        id:'fail',
        name:'不合适'
    }];
    $http.get('data/myPost.json').success(function (resp) {
        $scope.positionList = resp;
    });
    $scope.filterObj = {};
    $scope.tClick =function (id,name) {
        switch (id) {
            case 'all':
               delete $scope.filterObj.state;
                break;
            case 'pass':
                $scope.filterObj.state = '1';
                break;
            case 'fail':
                $scope.filterObj.state = '-1';
                break;
            default:
        }

    }
}]);
