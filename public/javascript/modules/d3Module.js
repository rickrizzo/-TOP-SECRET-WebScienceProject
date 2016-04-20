angular.module('d3', [])
  .factory('d3Service', ['$document', '$q', '$rootScope', function($document, $q, $rootScope) {
    var d = $q.defer();

    // Load Client
    function onScriptLoad() {
      $rootScope.$apply(function() { d.resolve(window.d3); });
    }

    // Import D3 Script
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = '/modules/d3/d3.min.js';
    scriptTag.onreadystatechange = function() {
      if(this.readyState == 'complete') onScriptLoad();
    }
    scriptTag.onload = onScriptLoad;

    // Add D3 Script
    var s = $document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);

    return {
      d3: function() { return d.promise; }
    };
  }]
);