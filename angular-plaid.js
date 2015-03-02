angular.module('ngPlaid', [])

.factory('ngPlaid', function ($http, $q) {
    
    var secret, client_id, server_url, access_token;
    
    function configure(options) {
        secret = options.secret;
        client_id = options.client_id;
        server_url = options.server_url || 'https://tartan.plaid.com';
    }
    
    function postRequest(path, data, suppressToken) {
        data.secret = secret;
        data.client_id = client_id;
        if (!suppressToken && !data.access_token) {
            data.access_token = access_token;
        }
        return $http.post(server_url + path, data);
    }
    
    function connect(username, password, institution_type, options) {
        
        var def = $q.defer();
        
        var body = {
            username: username,
            password: password,
            type: institution_type
        };
        
        postRequest('/connect', body, true)
            .success(function(data, status, headers, config) {
                access_token = data.access_token;
                def.resolve(data);
            })
            .error(function(data, status, headers, config) {
                console.log('ngPlaid error');
                console.log(JSON.stringify(data));
                console.log(status);
                console.log(headers);
                console.log(JSON.stringify(config));
                def.reject(data);
            });
        
        return def.promise;
    }
    
    function step(mfa, institution_type, options) {
        
        var def = $q.defer();
        
        var body = {
            mfa: mfa,
            type: institution_type
        };
        
        postRequest('/auth/step', body)
            .success(function(data, status, headers, config) {
                def.resolve(data);
            })
            .error(function(data, status, headers, config) {
                def.reject(data);
            });
        
        return def.promise;
    }
    
    function get(token) {
        
        var def = $q.defer();
        
        if (token) {
            access_token = token;
        }
                
        postRequest('/connect/get', {})
            .success(function(data, status, headers, config) {
                def.resolve(data);
            })
            .error(function(data, status, headers, config) {
                def.reject(data);
            });
        
        return def.promise;
    }
    
    return {
        configure: configure,
        connect: connect,
        step: step,
        get: get        
    };
    
});
