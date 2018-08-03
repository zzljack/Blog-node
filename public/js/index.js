$(function(){
    var $loginBox = $("#loginBox"),
        $registerBox = $('#registerBox'),
        $rightBox = $('#rightBox');
    
    $loginBox.on('click', 'a.colMint', function(){
        $registerBox.show();
        $loginBox.hide();
    })
    $registerBox.on('click', 'a.colMint', function(){
        $registerBox.hide();
        $loginBox.show();
    })
    $registerBox.on('click', 'button', function(){
        $.ajax({
            type: 'post',
            url:'/api/user/register',
            data:{
                'username': $registerBox.find('[name=username]').val(),
                'password': $registerBox.find('[name=password]').val(),
                'repassword': $registerBox.find('[name=repassword]').val()
            },
            dataType:'json',
            success:function(data){
                if(data.code == 0){
                    setTimeout(function(){
                        $registerBox.hide();
                        $loginBox.show();
                    },1000)
                }
                $registerBox.find('p.colWarning').text(data.message);
            }
        })
    })
    $loginBox.on('click', 'button', function(){
        $.ajax({
            type: 'post',
            url:'/api/user/login',
            data:{
                'username': $loginBox.find('[name=username]').val(),
                'password': $loginBox.find('[name=password]').val()
            },
            dataType:'json',
            success:function(data){
                window.location.reload();
                // if(data.code == 0){
                //     setTimeout(function(){
                //         $rightBox.show();
                //         $loginBox.hide();
                //         $("#userInfo").html(data.userInfo.username);
                //         $('#danger').html('你好，欢迎光临我的博客');
                //     },1000)
                // }
                // $loginBox.find('p.colWarning').text(data.message);
            }
        })
    })
    $('#logoutBtn').on('click', function(){
        $.ajax({
            type: 'get',
            url: '/api/user/logout',
            success:function(data){
                if(data.code == 0){
                    window.location.reload();
                }
            }
        })
    })
})