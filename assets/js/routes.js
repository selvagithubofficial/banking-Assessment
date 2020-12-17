myapp.config(function ($stateProvider,$urlRouterProvider) {
  $urlRouterProvider.otherwise('/home/list');
  $stateProvider
  .state('home',{
    url: '/home',
    templateUrl: 'assets\\directives\\mainhome.html'
})
.state('finalres',{
  url: '/finalres',
  templateUrl: 'assets\\directives\\finalres.html',
  controller: function($scope,$location,formv){
    setTimeout(function(){ 
     window.history.go(-1);
    }, 3000);
    console.log(formv.samp);
  }
})
.state('home.list', { //home page
  url: '/list',
  templateUrl: 'assets\\directives\\login.html',
  controller: function($scope,$location,formv) {
    console.log(formv.samp);
      $scope.usrdata="";
      $scope.usredata={name:"",upi:""};
      $scope.inval="";
      $scope.count=0;
      $scope.getdatas=function (){
      formv.getdatasS().then(function success(response) {
     console.log(formv.secondObj);
     formv.secondObj= formv.secondObj.length==0?response.data:formv.secondObj;
     formv.secondObj.userscln=[...formv.secondObj.userscln,...formv.sign_Objs]
        var newsecondObjs=[],uniqObjs={};
        for (let i in formv.secondObj.userscln) {
         let upis=formv.secondObj.userscln[i].upi;
         uniqObjs[upis]=formv.secondObj.userscln[i];
        }
        for (i in uniqObjs) {
          newsecondObjs.push(uniqObjs[i])
        }
     formv.secondObj.userscln=newsecondObjs
     console.log(formv.secondObj.userscln);
    //  var removedupli=(arr)=>{let uniq={};return arr.filter(obj=>![obj.upi] && (uniq[obj.upi]=true))}
    //  for (let i = 0; i < formv.sign_Objs.length; i++) {
    //   if(formv.sign_Objs.length!=0){
    //    for (let j = 0; j < formv.secondObj.userscln.length; j++) {
    //       if (formv.secondObj.userscln[j].upi!=formv.sign_Objs[i].upi) {
    //         if(formv.secondObj.userscln.length-1==j ){
    //            formv.secondObj.userscln.push(formv.sign_Objs[i])
    //         }    
    //    }
    //    }
    //    }
    //  }
     $scope.count++;
     for (let i = 0; i < formv.secondObj.userscln.length; i++) {
      if(formv.secondObj.userscln[i].username==$scope.usredata.name && formv.secondObj.userscln[i].upi==$scope.usredata.upi)
      {
        formv.selectedUsr=formv.secondObj.userscln[i];
        console.log("correct");
        $scope.inval="";
        $scope.count=0;
        formv.authUpi = formv.selectedUsr.upi;
        $location.path("/welcomeusr");
        break
      }
      else{
        console.log("error");
        console.log($scope.count);
        $scope.inval="Invalid Username or UPI ID";
        if($scope.count==3){
          $scope.hidebtn=true;
        }
      }
     }
  });
  }
}
})
.state('home.signup', {
  url: '/signup',
  templateUrl: 'assets\\directives\\signup.html',
  controller:function ($scope,formv, $location) {
    $scope.signupObj={username:"",upi:"",balance:10000,email_id:"","transactions":[],
     friends:[
        { id: "1001", fname: "vignesh",balance: 1000,email_id:"",upi_id: Math.floor(Math.random()*1000000)},
        { id: "1002", fname: "gopal", balance: 1000,email_id:"",upi_id: Math.floor(Math.random()*1000000)},
        { id: "1003", fname: "vijay",balance: 1000,email_id:"",upi_id: Math.floor(Math.random()*1000000)},
        { id: "1004", fname: "praveen" ,balance: 1000,email_id:"",upi_id: Math.floor(Math.random()*1000000)}]}
    $scope.userAddFun= ()=> {
      formv.sign_Objs.push($scope.signupObj);
      console.log($scope.signupObj)
      console.log(formv.sign_Objs);
      $location.path("/home/list");
    }
  }
})
.state('welcomeusr',{
  url: '/welcomeusr',
  templateUrl: 'assets\\directives\\welcomeusr.html',
  controller: function($scope,$location,formv) {
    console.log(formv.samp);
    $scope.selctUsr=formv.selectedUsr;
    console.log($scope.selctUsr);
    $scope.frdatas1="";
    $scope.addfrblk=false;
    $scope.getfrdatas= (fr,indx) => { 
      $scope.addfrblk=false;
      $scope.frdatas=fr;
      $scope.indx=indx;
      console.log(fr);
    }
    $scope.homefun=() =>{
      $location.path("/home/list");
    }
    $scope.newfrObj={id: "1001", fname: "",balance: 1000,email_id:"",upi_id: Math.floor(Math.random()*1000000),account_no: 0}
    $scope.newamnt="";
    $scope.Addnewfrblk= () =>{
    $scope.addfrblk=true;
    }
    $scope.Addnewfr= () => {
      console.log(formv.samp);
      $scope.newfrObj.balance+=$scope.newamnt;
      for (let i = 0; i < formv.secondObj.userscln.length; i++) {
        if($scope.selctUsr.upi==formv.secondObj.userscln[i].upi){
           formv.selectedUsr.friends.push(angular.copy($scope.newfrObj));
          // console.log($scope.selctUsr.friends);
          formv.secondObj.userscln[i].balance-=$scope.newamnt;
          formv.secondObj.userscln[i].transactions.push({upi:angular.copy($scope.newfrObj.upi_id),name:angular.copy($scope.newfrObj.fname),tramnt:angular.copy($scope.newamnt)})
          // formv.secondObj.userscln[i].friends.push(angular.copy($scope.newfrObj));
        }
      }
      console.log(formv.secondObj);
    }
    $scope.trnfr= (frdatas,indx) => {
      $scope.frdatas1=frdatas;
      console.log(indx);
      $scope.index=indx;
      $scope.transactedFrObj={upi:$scope.frdatas1.upi_id, name:$scope.frdatas1.fname,tramnt:0}
      console.log(formv.secondObj.userscln);
      console.log($scope.frdatas1);
      // $scope.$broadcast('TrasHistry',$scope.frdatas1.upi);
      for (let i = 0; i < formv.secondObj.userscln.length; i++) {
        for (let j = 0; j < formv.secondObj.userscln[i].friends.length; j++) {
          if($scope.frdatas1.upi_id==formv.secondObj.userscln[i].friends[j].upi_id){
            formv.secondObj.userscln[i].balance-=$scope.transAmt;
            if(!(formv.secondObj.userscln[i].balance<=0)){
            formv.secondObj.userscln[i].friends[j].balance+=$scope.transAmt;
            $scope.transactedFrObj.tramnt+=$scope.transAmt;
            formv.secondObj.userscln[i].transactions.push($scope.transactedFrObj)
            console.log(formv.secondObj);
            console.log(formv.secondObj.userscln);
            console.log($scope.transAmt);
            console.log(formv.secondObj.userscln[0].balance);
            $scope.transAmt="";
            $location.path("/finalres");
          }
          else alert("insufficient balance!!!")
        }
        }
      }
    }
    $scope.viewtransHistory=function () {
      console.log( $scope.selctUsr.transactions)
      $scope.viewtransHisprsns=$scope.selctUsr;
    }
  }
})
});