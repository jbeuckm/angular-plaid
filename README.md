Angular Plaid
==============

Consume the [Plaid API](https://plaid.com/docs/) with your Angular app.

###Installation###
bower install https://github.com/jbeuckm/angular-plaid.git

###Usage###

```javascript
angular.module('myModule', ['ngPlaid'])
	.run(function ($scope, ngPlaid){
	
		ngPlaid.configure({
			secret: 'MY_SECRET',
			client_id: 'MY_CLIENT_ID'
		});
		
		$scope.connect = function(){
		
			var username = 'plaid_test';
			var password = 'plaid_good';
			var institution_type = 'us';
		
			ngPlaid.connect(username, password, institution_type)
				.then(function(response){
					console.log('Plaid connect returned...');
					console.log(response);
					
					if (response.mfa) {
						mfaStep();
					}
					else {
						getTransactionData();
					}
				}, function(err){
					console.log('uh oh');
				});
		};
		
		function mfaStep() {
			ngPlaid.step('tomato')
				.then(function(response){
					console.log('Plaid step returned...');
					console.log(response);

					getTransactionData();
				}, function(err){
					console.log('doh');
				});
		}
		
		function getData() {
			ngPlaid.get()
				.then(function(data){
					console.log('Plaid data:');
					console.log(data);
				}, function(err){
					console.log('oops');
				});
		};
		
	});
```

