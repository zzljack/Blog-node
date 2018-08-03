var prepage = 2,
    page = 1,
    pages = 0,
    comment = [];
//初始化已评论 
$.ajax({
    type:'POST',
    url: '/api/comment/past',
    data:{
        contentid: $("#contentId").val()
    },
    success:function(data){
        comment = data.data.reverse();
        commentRendering();
    }
})
// 提交评论
$('#messageBtn').on('click', function(){
    $.ajax({
        type:'POST',
        url: '/api/comment/post',
        data:{
            contentid: $("#contentId").val(),
            content:$('#messageContent').val()
        },
        success:function(resdata){
            $('#messageContent').val("");
            comments = resdata.data.comments.reverse();
            page = 1;
            commentRendering();
        }
    })
})
// 点击翻页
$('.pager').on('click', 'a', function(){
    if($(this).parent().hasClass('previous')){
        page--;
    }else{
        page++;
    }
    commentRendering();
})
// 评论渲染
function commentRendering(){
    var html = '';
    pages = Math.max(Math.ceil(comment.length/prepage),1);
    var start = Math.max(0, (page-1)*prepage);
    var end = Math.min(start+prepage, comment.length);
    $('.pageNum').html(page+'/'+pages);

    if(page <= 1){
        page = 1
        $('.previous').html('<span>没有上一页了</span>');
    }else{
        $('.previous').html('<a href="javascript:;">上一页</a>');
    }

    if(page >= pages){
        page = pages;
        $('.next').html('<span>没有下一页了</span>');
    }else{
        $('.next').html('<a href="javascript:;">下一页</a>');
    }
    
    if(comment.length>0){
        for(var i=start; i<end; i++){
            html += '<div class="messageBox">'+
                        '<p class="name clear"><span class="fl">'+comment[i].username+'</span><span class="fr" style="font-size:14px;">'+setTime(comment[i].postTime)+'</span></p>'+
                        '<p>'+comment[i].content+'</p>'+
                    '</div>';
        }
    }else{
        html = '<div class="messageBox"><p>还没有留言</p></div>';
    }
    $("#messageCount").html(comment.length);
    $('.messageList').html(html);
}
function setTime(time){
    var date = new Date(time),
        getFullYear = date.getFullYear(),
        getMonth = date.getMonth(),
        getDate = date.getDate()+1,
        getHours = date.getHours(),
        getMinutes = date.getMinutes(),
        getSeconds = date.getSeconds();
    return getFullYear+'-'+getMonth+'-'+getDate+' '+getHours+':'+getMinutes+':'+getSeconds;
}