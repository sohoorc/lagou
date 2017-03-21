angular.module('app').directive('appHead',['cache',function (cache) {
    return {
        restrict: 'A', //AEMC 属性，元素，样式，注释
        replace: true, //替换父级dom元素
        templateUrl: 'view/template/head.html',
        link: function ($scope) {
            $scope.name = cache.get('name') || '';
        }
    }
}]);

angular.module('app').directive('appFoot',[function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/foot.html'
    }
}]);

angular.module('app').directive('appPositionList',['$http',function ($http) {
    return {
        restrict: 'A', //AEMC 属性，元素，样式，注释
        replace: true, //替换父级dom元素
        templateUrl: 'view/template/positionList.html',
        scope: {
            data: '=',
            filterObj:'=',
            isFavorite: '='
        },
        link: function ($scope) {

            $scope.select = function (item) {
                $http.post('data/favorite.json',{
                    id:item.id,
                    select:!item.select
                }).success(function (resp) {
                    item.select = !item.select;
                })


            }
        }
    }
}]);

/*职位详情*/

angular.module('app').directive('appHeadBar',[function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/headbar.html',
        scope: {
            text: '@'
        },
        link: function ($scope) { //为指令定制内在函数
            $scope.back = function () {
                window.history.back(); //返回
            };
        }
    }
}]);

angular.module('app').directive('appPositionInfo',['$http',function ($http) {
    return {
        restrict: 'A',
        replace: true,
        scope: {
          isActive: '=',
          isLogin: '=',
          pos: '='
        },
        templateUrl: 'view/template/positionInfo.html',
        link: function ($scope) {//为星星设置点击后的事件

            $scope.$watch('pos',function (newVal) {
                if(newVal) {
                    $scope.pos.select = $scope.pos.select || false;
                    $scope.imagePath =$scope.pos.select? 'image/star-active.png':'image/star.png';
                }
            })

            $scope.favorite = function () {
                $http.post('data/favorite.json',{
                    id:$scope.pos.id,
                    select: !$scope.pos.select
                }).success(function (resp) {
                    $scope.pos.select = !$scope.pos.select;
                    $scope.imagePath =$scope.pos.select? 'image/star-active.png':'image/star.png';
                })
            }
        }
    }
}]);

angular.module('app').directive('appCompany',[function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            com: '='
        },
        templateUrl: 'view/template/company.html'

    }
}]);

angular.module('app').directive('appPositionClass',[function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
          com: '='
        },
        templateUrl: 'view/template/positionClass.html',
        link: function ($scope) {

            $scope.showPositionList = function (idx) {
                $scope.positionList = $scope.com.positionClass[idx].positionList;
                $scope.isActive = idx;
            }
            $scope.$watch('com',function (newVal) {
                if(newVal) $scope.showPositionList(0);
            })

        }
    }
}]);

/*搜索页面*/

angular.module('app').directive('appTab',[function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/tab.html',
        scope: {
          list: '=',
          tabClick: '&',

        },
        link: function ($scope) {
            $scope.click = function (tab) {
                $scope.selectId = tab.id;
                $scope.tabClick(tab);
            }
        }

    }
}]);

angular.module('app').directive('appSheet',[function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
          list: '=',
          visible: '=',
            select: '&'
        },
        templateUrl: 'view/template/sheet.html'

    }
}]);

angular.module('app').value('dict',{}).run(['dict','$http',function (dict,$http) {
    $http.get('data/city.json').success(function (resp) {
        dict.city = resp;
    });
    $http.get('data/salary.json').success(function (resp) {
        dict.salary = resp;
    });
    $http.get('data/scale.json').success(function (resp) {
        dict.scale = resp;
    });

}]);

